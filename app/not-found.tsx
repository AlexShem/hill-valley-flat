import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">404 - Page Not Found</h1>
            <p className="mb-8 text-lg text-gray-700">Sorry, the page you are looking for does not exist.</p>
            <Link
                href="/"
                className={buttonVariants({variant: "default", size: "lg"})}
            >
                Go Back Home
            </Link>
        </div>
    );
}