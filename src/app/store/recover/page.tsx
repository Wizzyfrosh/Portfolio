import Link from "next/link";

export default function RecoverPurchase() {
  return <main className="min-h-screen bg-gray-50 px-6 py-16 text-gray-900 dark:bg-gray-950 dark:text-white">
    <div className="mx-auto max-w-xl space-y-5 rounded-2xl border bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h1 className="text-3xl font-bold">Recover your template</h1>
      <p>Already paid? You do not need to pay again. Find the Paystack transaction reference on your payment confirmation or Paystack receipt, then use the same email from checkout.</p>
      <form action="/store/complete" method="get" className="space-y-4">
        <label className="block text-sm font-medium">Paystack transaction reference
          <input name="reference" required maxLength={100} placeholder="frosh_..." className="mt-2 w-full rounded-lg border p-3 text-gray-900" />
        </label>
        <button className="rounded-full bg-blue-600 px-6 py-3 font-semibold text-white">Continue to verification</button>
      </form>
      <p className="text-sm text-gray-500">On the next page, enter your original purchase email. After payment verification you will receive a fresh two-minute download link.</p>
      <Link href="/store" className="block text-blue-600">Back to store</Link>
    </div>
  </main>;
}
