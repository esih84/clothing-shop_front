import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { Metadata } from "next";
import { getPaymentLink } from "@/features/payment/payment-link-api";
import { formatToman } from "@/shared/lib/utils";
import PayLinkButton from "./pay-link-button";

export const dynamic = "force-dynamic";

/**
 * The link is meant for one person and shows their order; it has no business in search results
 * or in a link preview posted to a group chat.
 */
export const metadata: Metadata = {
  title: "پرداخت سفارش",
  robots: { index: false, follow: false },
};

/**
 * Deadline of the link, to the minute. The payment window is only a day long, so a bare date
 * would leave the customer guessing how much of today they still have.
 */
function formatDeadline(value: string): string {
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("fa-IR", {
    calendar: "persian",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** A single row of the amount summary. Amounts stack vertically so they stay readable in RTL. */
function AmountRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className={strong ? "font-semibold text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
      <span className={strong ? "font-bold text-foreground" : "text-foreground"}>
        {value}
      </span>
    </div>
  );
}

function Notice({
  tone,
  icon,
  title,
  children,
}: {
  tone: "success" | "error" | "warning";
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}) {
  const toneClass = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-amber-600",
  }[tone];

  return (
    <div className="text-center space-y-3">
      <div className={`mx-auto ${toneClass}`}>{icon}</div>
      <h1 className="text-lg font-bold text-foreground">{title}</h1>
      {children && (
        <div className="text-sm text-muted-foreground space-y-1">{children}</div>
      )}
    </div>
  );
}

/**
 * Public payment page for an order placed by the shop on a customer's behalf.
 *
 * No sign-in: the token in the URL is the only credential, so the page shows just enough for the
 * customer to check the order is theirs and pay it. `status` is set when the gateway sends them
 * back here after a payment attempt.
 */
export default async function PaymentLinkPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ status?: string; refId?: string }>;
}) {
  const { token } = await params;
  const { status: returnStatus, refId } = await searchParams;
  const { data: link } = await getPaymentLink(token);

  const card =
    "bg-card rounded-2xl shadow-sm border border-border p-5 space-y-4";

  if (!link) {
    return (
      <div className="max-w-md mx-auto p-4 py-10" style={{ direction: "rtl" }}>
        <div className={card}>
          <Notice
            tone="error"
            icon={<XCircle className="w-16 h-16" />}
            title="لینک پرداخت معتبر نیست"
          >
            <p>
              این لینک اشتباه است یا جای دیگری برای شما لینک تازه‌ای ساخته شده.
              لطفاً با فروشگاه تماس بگیرید.
            </p>
          </Notice>
          <Link
            href="/"
            className="block w-full text-center text-secondary py-2 font-medium hover:underline"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  // Anything past "awaiting payment" other than a cancellation means the money arrived.
  const settled =
    link.status !== "awaiting_payment" && link.status !== "cancelled";
  const sa = link.shippingAddress;
  const orderLabel = link.orderNumber ?? "";

  return (
    <div
      className="max-w-md mx-auto p-4 py-8 space-y-4"
      style={{ direction: "rtl" }}
    >
      {/* Result of the attempt the customer just came back from */}
      {returnStatus === "success" && (
        <div className={card}>
          <Notice
            tone="success"
            icon={<CheckCircle2 className="w-14 h-14 mx-auto" />}
            title="پرداخت با موفقیت انجام شد"
          >
            {refId && (
              <p dir="ltr">
                کد پیگیری پرداخت: <span className="font-bold">{refId}</span>
              </p>
            )}
            <p>سفارش شما ثبت و تأیید شد. از خرید شما سپاسگزاریم.</p>
          </Notice>
        </div>
      )}
      {returnStatus === "failed" && (
        <div className={card}>
          <Notice
            tone="error"
            icon={<XCircle className="w-14 h-14 mx-auto" />}
            title="پرداخت انجام نشد"
          >
            <p>
              تراکنش تأیید نشد یا لغو شد. مبلغی از حساب شما کسر نشده است؛
              می‌توانید دوباره تلاش کنید.
            </p>
          </Notice>
        </div>
      )}

      <div className={card}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-bold text-foreground">
            {orderLabel ? `سفارش ${orderLabel}` : "سفارش شما"}
          </h2>
          {link.payable && link.expiresAt && (
            <span className="flex items-center gap-1 text-xs text-amber-600">
              <Clock className="w-4 h-4" />
              تا {formatDeadline(link.expiresAt)}
            </span>
          )}
        </div>

        <ul className="divide-y divide-border">
          {link.items.map((item, index) => (
            <li
              key={`${item.productName}-${index}`}
              className="py-3 flex items-start justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm text-foreground line-clamp-2">
                  {item.productName}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.quantity.toLocaleString("fa-IR")} ×{" "}
                  {formatToman(item.unitPrice)}
                </p>
              </div>
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {formatToman(item.totalPrice)}
              </span>
            </li>
          ))}
        </ul>

        <div className="space-y-2 pt-1">
          <AmountRow label="جمع کالاها" value={formatToman(link.totalAmount)} />
          {link.discountAmount > 0 && (
            <AmountRow
              label="تخفیف"
              value={formatToman(link.discountAmount)}
            />
          )}
          <div className="border-t border-border pt-2">
            <AmountRow
              label="مبلغ قابل پرداخت"
              value={formatToman(link.finalAmount)}
              strong
            />
          </div>
        </div>
      </div>

      {(sa || link.shippingMethodLabel) && (
        <div className={card}>
          <h3 className="font-semibold text-sm text-foreground">
            اطلاعات ارسال
          </h3>
          {sa && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="text-foreground">
                {[sa.firstName, sa.lastName].filter(Boolean).join(" ")}
              </p>
              <p>
                {[sa.province, sa.city].filter(Boolean).join("، ")} — {sa.address}
                {sa.plaque ? `، پلاک ${sa.plaque}` : ""}
              </p>
            </div>
          )}
          {link.shippingMethodLabel && (
            <p className="text-sm text-muted-foreground">
              روش ارسال: {link.shippingMethodLabel}
            </p>
          )}
        </div>
      )}

      <div className={card}>
        {link.payable ? (
          <>
            <PayLinkButton token={token} amount={link.finalAmount} />
            <p className="text-xs text-muted-foreground text-center">
              پرداخت از طریق درگاه امن زرین‌پال انجام می‌شود.
            </p>
          </>
        ) : link.status === "cancelled" ? (
          <Notice
            tone="error"
            icon={<XCircle className="w-12 h-12 mx-auto" />}
            title="این سفارش لغو شده است"
          >
            <p>برای ثبت سفارش تازه با فروشگاه تماس بگیرید.</p>
          </Notice>
        ) : link.expired && !settled ? (
          <Notice
            tone="warning"
            icon={<Clock className="w-12 h-12 mx-auto" />}
            title="مهلت این لینک پرداخت تمام شده است"
          >
            <p>
              برای دریافت لینک تازه با فروشگاه تماس بگیرید؛ کالاهای این سفارش
              دیگر رزرو نیستند.
            </p>
          </Notice>
        ) : (
          <Notice
            tone="success"
            icon={<CheckCircle2 className="w-12 h-12 mx-auto" />}
            title="این سفارش پرداخت شده است"
          >
            <p>سفارش شما در حال پیگیری است.</p>
          </Notice>
        )}
        <Link
          href="/"
          className="block w-full text-center text-secondary py-2 font-medium hover:underline"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    </div>
  );
}
