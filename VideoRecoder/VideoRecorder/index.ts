import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class VideoRecorder implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    private _container: HTMLDivElement;
    private _videoElement: HTMLVideoElement;
    private _startButton: HTMLButtonElement;
    private _uploadButton: HTMLButtonElement;
    private _stopButton: HTMLButtonElement;
    private _errorElement: HTMLDivElement;
    private _mediaRecorder: MediaRecorder | null;
    private _recordedChunks: Blob[];
    private _videoUrl: string;

    constructor() {
        this._recordedChunks = [];
        this._videoUrl = "";
        this._mediaRecorder = null;
    }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;

        // Create UI elements
        this._videoElement = document.createElement("video");
        this._videoElement.controls = true;
        this._videoElement.style.width = "100%";

        this._startButton = document.createElement("button");
        this._startButton.innerText = "Start Recording";
        this._startButton.onclick = () => this.startRecording();

        this._stopButton = document.createElement("button");
        this._stopButton.innerText = "Stop Recording";
        this._stopButton.disabled = true;
        this._stopButton.onclick = () => this.stopRecording();

        this._uploadButton = document.createElement("button");
        this._uploadButton.innerText = "Upload Recording";
        this._uploadButton.disabled = true; // Disabled until recording is stopped
        this._uploadButton.onclick = () => this.uploadVideo();

        // Create error message element
        this._errorElement = document.createElement("div");
        this._errorElement.style.color = "red";
        this._errorElement.style.marginTop = "10px";
        this._errorElement.className = "errorMessage";

        // Append elements to container
        this._container.appendChild(this._videoElement);
        this._container.appendChild(this._startButton);
        this._container.appendChild(this._stopButton);
        this._container.appendChild(this._uploadButton);
        this._container.appendChild(this._errorElement);
    }

    private async startRecording(): Promise<void> {
        this._errorElement.innerText = "";
        try {
            // Request back camera with facingMode: "environment"
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: true
            });
            this._videoElement.srcObject = stream;
            this._videoElement.play();

            this._mediaRecorder = new MediaRecorder(stream);
            this._recordedChunks = [];

            this._mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this._recordedChunks.push(event.data);
                }
            };

            this._mediaRecorder.start();
            this._startButton.disabled = true;
            this._stopButton.disabled = false;
            this._uploadButton.disabled = true;
        } catch (error) {
            this._errorElement.innerText = "Failed to access camera/microphone. Please ensure permissions are granted.";
            console.error("Recording error:", error);
        }
    }

    private stopRecording(): void {
        if (this._mediaRecorder && this._mediaRecorder.state !== "inactive") {
            this._mediaRecorder.stop();
            this._videoElement.srcObject = null;
            this._startButton.disabled = false;
            this._stopButton.disabled = true;
            this._uploadButton.disabled = false; // Enable upload button after stopping
        }
        console.log("from stopRecording() test");
    }

    private async uploadVideo(): Promise<void> {
        console.log("test");
        this._errorElement.innerText = "";
    
        if (this._recordedChunks.length === 0) {
            this._errorElement.innerText = "No video recorded. Please record a video first.";
            this._errorElement.style.color = "red";
            return;
        }

        const blob = new Blob(this._recordedChunks, { type: "video/webm" });
        const fileName = `Video_${new Date().toISOString()}.webm`;
    
        const reader = new FileReader();
        reader.readAsDataURL(blob);
    
        reader.onloadend = async () => {
            const base64Data = reader.result?.toString().split(",")[1]; // Remove "data:..." prefix
    
            console.log("Base64 length:", base64Data?.length);
            console.log("Sending filename:", fileName);
    
            try {
                const response = await fetch("https://prod-14.centralindia.logic.azure.com:443/workflows/21547afd4894460a88b9221a249f5a40/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MR1CosjZY0G_UW4KLiQdqNJEu4RmERCh7hPbRopYges", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        VideoFile: base64Data,
                        FileName: fileName
                    })
                });
    
                console.log("Upload status:", response.status);
    
                const responseText = await response.text();
                console.log("Response text:", responseText);
    
                if (!response.ok) {
                    throw new Error(`Upload failed: ${response.statusText}`);
                }
    
                // If it's just plain URL in responseText
                this._videoUrl = responseText.trim();
                this._notifyOutputChanged();
    
                this._videoElement.src = this._videoUrl;
                this._errorElement.innerText = "Video uploaded successfully!";
                this._errorElement.style.color = "green";
                this._uploadButton.disabled = true; // Disable upload button after successful upload
            } catch (error) {
                this._errorElement.innerText = "Failed to upload video. Check console for details.";
                this._errorElement.style.color = "red";
                console.error("Upload error:", error);
            }
        };
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Update control if needed
    }

    public getOutputs(): IOutputs {
        return {
            videoUrl: this._videoUrl
        };
    }

    public destroy(): void {
        if (this._mediaRecorder && this._mediaRecorder.state !== "inactive") {
            this._mediaRecorder.stop();
        }
        if (this._videoElement.srcObject) {
            const tracks = (this._videoElement.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
        }
        this._videoElement.srcObject = null;
    }
}







