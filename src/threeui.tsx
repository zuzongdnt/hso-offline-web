import { LandingPageFrame, type LandingPageProps } from './shaders/landing-pages/LandingPageFrame';

// The registered component lives in upstream/LandingPages.tsx.
export function SublevelStudioLandingPage(props: LandingPageProps) {
  return (
    <LandingPageFrame
      {...props}
      title="Thời Đại Hiệp Sĩ Offline"
      sourceUrl={`${import.meta.env.BASE_URL}landing-pages/sublevel-studio.html`}
    />
  );
}
