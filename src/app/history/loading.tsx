import { Container } from "@/components/layout/Container";
import { Loading } from "@/components/common/Loading";

export default function HistoryLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container size="lg" className="py-8">
        <Loading size="lg" text="Loading history..." />
      </Container>
    </div>
  );
}
