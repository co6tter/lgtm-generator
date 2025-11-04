import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/common/Button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-gray-50">
      <Container size="md" className="py-16">
        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
          <FileQuestion className="mx-auto mb-4 h-16 w-16 text-gray-400" aria-hidden="true" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900">404 - Page Not Found</h1>
          <p className="mb-6 text-gray-600">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/">
            <Button variant="primary">Go to Home</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
