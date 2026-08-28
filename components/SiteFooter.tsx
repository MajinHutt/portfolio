import { site } from "@/lib/site";
import { CvLink } from "@/components/CvLink";
import { ProtectedEmail } from "@/components/human/ProtectedEmail";

/**
 * Dark footer, three equal cells divided by 1px on-dark rules.
 * Note the accent step change: on this dark ground the primary button hovers
 * *lighter* (#ff563c), not darker.
 */
export function SiteFooter() {
  return (
    <footer className="bg-panel text-fg">
      <div className="mx-auto max-w-page">
        <div className="grid grid-cols-1 border-b border-on-dark-rule min-[600px]:grid-cols-3">
          <div className="border-b border-on-dark-rule p-10 min-[600px]:border-b-0 min-[600px]:border-r">
            <p className="t-eyebrow mb-4 text-[rgba(243,242,242,0.7)]">
              Available for
            </p>
            <p className="text-[24px] font-extrabold leading-[1.2] tracking-h3">
              {site.availableFor.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <div className="border-b border-on-dark-rule p-10 min-[600px]:border-b-0 min-[600px]:border-r">
            <p className="t-eyebrow mb-4 text-[rgba(243,242,242,0.7)]">Contact</p>
            <ul className="flex flex-col gap-2">
              <li>
                <ProtectedEmail
                  showAddress
                  prompt="Show email"
                  className="text-[16px] text-fg no-underline transition-colors duration-[140ms] ease-out hover:text-accent-400"
                />
              </li>
              {site.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[16px] text-fg no-underline transition-colors duration-[140ms] ease-out hover:text-accent-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-end p-10">
            <CvLink
              label="Curriculum vitae"
              className="t-button inline-flex w-fit items-center border-2 border-divider bg-accent px-[18px] py-3 text-white no-underline transition-colors duration-[140ms] ease-out hover:bg-accent-700"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 px-10 py-4 text-[11px] uppercase tracking-nav opacity-55 min-[600px]:flex-row min-[600px]:items-center min-[600px]:justify-between">
          <span>
            {site.name}: {site.role}
          </span>
          <span>Built in Blender, shown in the browser</span>
        </div>
      </div>
    </footer>
  );
}
