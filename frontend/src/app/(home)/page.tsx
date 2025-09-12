import HomeViews from "@/modules/home/ui/views/home-views";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { categoryId } = await searchParams;
  return (
    <div className="w-full">
      <HomeViews categoryId={categoryId} />
    </div>
  );
}
