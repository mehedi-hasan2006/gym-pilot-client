import { payment } from "@/lib/payment/payment";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Mail, ArrowRight, Calendar, Clock, Dumbbell, Home } from "lucide-react";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const {
    status,
    metadata,
    customer_details: { email: customerEmail },
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    await payment({ ...metadata, sessionId: session_id });

    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-8 text-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              </div>

              {/* Success Icon */}
              <div className="relative inline-flex mb-6">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <CheckCircle className="w-14 h-14 text-white" />
                </div>
                {/* Animated Rings */}
                <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-ping"></div>
                <div className="absolute -inset-2 border-2 border-white/20 rounded-full animate-pulse"></div>
              </div>

              <h1 className="relative text-4xl font-black text-white mb-2">
                Payment Successful!
              </h1>
              <p className="relative text-white/90 text-lg">
                Your booking has been confirmed
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Booking Details */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-blue-500" />
                  Booking Details
                </h3>
                
                <div className="space-y-3">
                  {metadata.className && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-400">Class</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {metadata.className}
                      </span>
                    </div>
                  )}
                  
                  {metadata.price && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-400">Amount Paid</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ${metadata.price}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-400">Payment ID</span>
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                      {session_id.slice(0, 16)}...
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Notification */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-6 border border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Confirmation Email Sent
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      We appreciate your business! A confirmation email will be sent to{" "}
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {customerEmail}
                      </span>
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs">
                      If you have any questions, please email{" "}
                      <a
                        href="mailto:orders@example.com"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        orders@example.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 mb-8 border border-purple-100 dark:border-purple-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  What's Next?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span>Check your email for class schedule and details</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Dumbbell className="w-4 h-4 text-purple-500" />
                    <span>Prepare for your first class with our starter guide</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>Mark your calendar with class dates and times</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/all-classes"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.02]"
                >
                  <Dumbbell className="w-5 h-5" />
                  Browse More Classes
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                >
                  <Home className="w-5 h-5" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Need immediate assistance?{" "}
            <a
              href="mailto:support@fitstudio.com"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    );
  }
}