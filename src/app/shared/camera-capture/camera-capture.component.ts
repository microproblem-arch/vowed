import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';

type CameraStatus = 'idle' | 'requesting' | 'ready' | 'review' | 'error';
type CameraFacing = 'environment' | 'user';

@Component({
  selector: 'app-camera-capture',
  templateUrl: './camera-capture.component.html',
  styleUrl: './camera-capture.component.scss',
})
export class CameraCaptureComponent implements OnDestroy {
  private readonly injector = inject(Injector);
  private readonly videoElement = viewChild<ElementRef<HTMLVideoElement>>('video');
  private stream: MediaStream | undefined;
  private previewUrl: string | undefined;
  private toastTimeout: ReturnType<typeof setTimeout> | undefined;

  protected readonly status = signal<CameraStatus>('idle');
  protected readonly errorMessage = signal('');
  protected readonly canSwitchCamera = signal(false);
  protected readonly facingMode = signal<CameraFacing>('environment');
  protected readonly capturedImageUrl = signal<string | undefined>(undefined);
  protected readonly captureNotice = signal('');
  protected readonly isCapturing = signal(false);

  readonly coupleNames = input.required<string>();
  readonly dateLabel = input.required<string>();
  readonly photoCount = input.required<number>();
  readonly maxPhotos = input(20);
  readonly hideLauncher = input(false);
  readonly remainingPhotoCount = computed(() => Math.max(0, this.maxPhotos() - this.photoCount()));
  readonly photoCaptured = output<Blob>();

  async openCamera(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.showError('Camera capture is not supported by this browser.');
      return;
    }

    this.stopStream();
    this.status.set('requesting');
    this.errorMessage.set('');

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: this.facingMode() } },
      });
      this.status.set('ready');
      afterNextRender(() => this.connectVideo(), { injector: this.injector });
      await this.updateCameraSwitchAvailability();
    } catch (error: unknown) {
      this.showError(this.getCameraErrorMessage(error));
    }
  }

  async switchCamera(): Promise<void> {
    this.facingMode.update((facing) => (facing === 'environment' ? 'user' : 'environment'));
    await this.openCamera();
  }

  async capture(): Promise<void> {
    if (this.isCapturing() || this.remainingPhotoCount() === 0) {
      return;
    }

    const video = this.videoElement()?.nativeElement;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      this.showError('The camera is still preparing. Please try again in a moment.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      this.showError('We could not prepare the image capture.');
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.isCapturing.set(true);
    const image = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.9),
    );
    this.isCapturing.set(false);
    if (!image) {
      this.showError('We could not create the image. Please try again.');
      return;
    }

    this.clearPreview();
    this.previewUrl = URL.createObjectURL(image);
    this.capturedImageUrl.set(this.previewUrl);
    this.photoCaptured.emit(image);
    this.showCaptureNotice();
  }

  openLatestPhoto(): void {
    if (!this.capturedImageUrl()) {
      return;
    }

    this.status.set('review');
  }

  backToCamera(): void {
    this.status.set('ready');
    afterNextRender(() => this.connectVideo(), { injector: this.injector });
  }

  close(): void {
    this.stopStream();
    this.clearPreview();
    this.status.set('idle');
    this.errorMessage.set('');
  }

  ngOnDestroy(): void {
    this.stopStream();
    this.clearPreview();
    clearTimeout(this.toastTimeout);
  }

  private connectVideo(): void {
    const video = this.videoElement()?.nativeElement;
    if (!video || !this.stream) {
      return;
    }

    video.srcObject = this.stream;
    void video.play().catch(() => undefined);
  }

  private async updateCameraSwitchAvailability(): Promise<void> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.canSwitchCamera.set(devices.filter((device) => device.kind === 'videoinput').length > 1);
    } catch {
      this.canSwitchCamera.set(false);
    }
  }

  private stopStream(): void {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = undefined;
  }

  private clearPreview(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = undefined;
    this.capturedImageUrl.set(undefined);
  }

  private showCaptureNotice(): void {
    clearTimeout(this.toastTimeout);
    const remaining = this.remainingPhotoCount();
    this.captureNotice.set(
      remaining === 0
        ? 'Temporary album is full for this demo session.'
        : `Photo added to your temporary album. ${remaining} more ${remaining === 1 ? 'photo' : 'photos'} available.`,
    );
    this.toastTimeout = setTimeout(() => this.captureNotice.set(''), 4000);
  }

  private showError(message: string): void {
    this.stopStream();
    this.status.set('error');
    this.errorMessage.set(message);
  }

  private getCameraErrorMessage(error: unknown): string {
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      return 'Camera permission was denied. Allow camera access in your browser settings to take a photo.';
    }
    if (error instanceof DOMException && error.name === 'NotFoundError') {
      return 'No camera was found on this device.';
    }
    return 'We could not open the camera. Please try again.';
  }
}
