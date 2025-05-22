import { getStockChartData } from "@/components/stock-chart/action";
import StockChart from "@/components/stock-chart/stock-chart";
import StockRefresh from "@/components/stock-refresh/stock-refresh";
import { revalidatePath } from "next/cache";

export default async function page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const id = (await params).id;

  const stockChartData = await getStockChartData(id);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-end">
        <StockRefresh
          id={id}
          onOk={async () => {
            "use server";
            revalidatePath(`/stock/${id}`);
          }}
        />
      </div>
      <div className="flex-1 h-0">
        <StockChart srockChartData={stockChartData} />
      </div>
    </div>
  );
}
