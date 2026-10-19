import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Icon } from '../../../shared/ui/icon/icon';
import { DocumentsRepository } from '../../../core/bibliotheque/documents-repository';
import { AppRoutes } from '../../../core/router/app-routes';

@Component({
  selector: 'nl-pdf-reader',
  standalone: true,
  imports: [CommonModule, Icon, PdfViewerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pdf-reader.html',
  styleUrl: './pdf-reader.scss',
})
export class PdfReader implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly docsRepo = inject(DocumentsRepository);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly url = signal<string | undefined>(undefined);
  protected readonly safeUrl = signal<SafeResourceUrl | null>(null);
  protected readonly fallback = signal(false);
  protected readonly documentId = signal<string>('');
  private fallbackTimeout: ReturnType<typeof setTimeout> | null = null;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.documentId.set(id);
    if (!id) {
      this.error.set('Document non spécifié.');
      this.loading.set(false);
      return;
    }

    try {
      const fresh = await this.docsRepo.urlLecture(id);
      const finalUrl = fresh || this.route.snapshot.queryParamMap.get('url') || undefined;
      if (finalUrl) {
        this.setUrl(finalUrl);
        void this.docsRepo.recordView(id);
      } else {
        const doc = await this.docsRepo.getById(id);
        if (doc?.urlPdf) {
          this.setUrl(doc.urlPdf);
          void this.docsRepo.recordView(id);
        } else {
          this.error.set('Impossible d\'obtenir l\'URL du document.');
        }
      }
    } catch (e) {
      this.error.set('Impossible d\'ouvrir le document.');
    } finally {
      this.loading.set(false);
    }
  }

  private setUrl(url: string): void {
    this.url.set(url);
    this.safeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
    this.fallbackTimeout = setTimeout(() => {
      console.warn('[PdfReader] délai dépassé, bascule vers iframe');
      this.fallback.set(true);
    }, 8000);
  }

  protected goBack(): void {
    void this.router.navigateByUrl('/app/' + AppRoutes.docDetailPath(this.documentId()));
  }

  protected openInNewTab(): void {
    const url = this.url();
    if (url) window.open(url, '_blank');
  }

  protected onError(error: unknown): void {
    console.error('[PdfReader] erreur lecteur PDF intégré', error);
    this.clearFallbackTimeout();
    this.fallback.set(true);
  }

  protected onLoaded(): void {
    this.clearFallbackTimeout();
  }

  private clearFallbackTimeout(): void {
    if (this.fallbackTimeout) {
      clearTimeout(this.fallbackTimeout);
      this.fallbackTimeout = null;
    }
  }
}
