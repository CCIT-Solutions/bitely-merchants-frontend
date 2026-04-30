import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLang } from "@/hooks/useLang";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Animate from "../animation/Animate";
import { fade } from "@/lib/animation";

interface BreadcrumbProps {
  page?: string;
  between?: {
    link: string;
    title: string;
    preventLinks?: boolean;
  }[];
  preventLinks?: boolean;
}

function MainBreadcrumb({ page, between = [], preventLinks }: BreadcrumbProps) {
  const { t, isRTL } = useLang();

  const MaybeLink = ({
    href,
    children,
    disabled,
  }: {
    href: string;
    children: React.ReactNode;
    disabled?: boolean;
  }) =>
    disabled ? (
      <BreadcrumbPage className="text-muted-foreground cursor-default">
        {children}
      </BreadcrumbPage>
    ) : (
      <BreadcrumbLink asChild>
        <Link href={href}>{children}</Link>
      </BreadcrumbLink>
    );

  return (
    <Animate variants={fade}>
      <Breadcrumb>
        <BreadcrumbList>
          {/* Home */}
          <BreadcrumbItem>
            {preventLinks ? (
              <BreadcrumbPage className="text-muted-foreground">
                {t("nav.home")}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href="/">{t("nav.home")}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>

          {/* Separator after Home */}
          {(between?.length > 0 || page) && (
            <BreadcrumbSeparator>
              {isRTL ? (
                <IoIosArrowBack className="w-4 h-4 text-muted-foreground" />
              ) : (
                <IoIosArrowForward className="w-4 h-4 text-muted-foreground" />
              )}
            </BreadcrumbSeparator>
          )}

          {/* Between Items */}
          {between?.length > 0 &&
            between.map((item, index) => {
              const isDisabled = preventLinks || item.preventLinks === true;

              return (
                <span
                  key={item.link}
                  className="inline-flex items-center gap-1.5"
                >
                  <BreadcrumbItem>
                    <MaybeLink href={item.link} disabled={isDisabled}>
                      {item.title}
                    </MaybeLink>
                  </BreadcrumbItem>

                  {(index < between.length - 1 || page) && (
                    <BreadcrumbSeparator>
                      {isRTL ? (
                        <IoIosArrowBack className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <IoIosArrowForward className="w-4 h-4 text-muted-foreground" />
                      )}
                    </BreadcrumbSeparator>
                  )}
                </span>
              );
            })}

          {/* Final Page */}
          {page && (
            <BreadcrumbItem>
              <BreadcrumbPage>{page}</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </Animate>
  );
}

export default MainBreadcrumb;
