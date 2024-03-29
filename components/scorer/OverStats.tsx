import {
  Bar,
  BarChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { BarChart3 } from "lucide-react";

function OverStats({
  chartSummaryData,
  runRate,
}: {
  runRate: number;
  chartSummaryData: { runs: number }[];
}) {
  const renderCustomizedLabel = (props: any) => {
    const { x, y, width, value } = props;
    const radius = 10;

    return (
      <text
        x={x + width / 2}
        y={y - radius}
        fill="hsl(var(--foreground))"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value}
      </text>
    );
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="icon">
          <BarChart3 />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="pt-6 pb-4 mb-2 ">
          <DrawerTitle className="text-2xl text-center">
            CRR: {runRate}
          </DrawerTitle>
        </DrawerHeader>
        <div className="h-96 p-2">
          {chartSummaryData.length > 0 ? (
            <div className="h-full max-w-7xl mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={100}
                  height={40}
                  data={chartSummaryData}
                  margin={{ top: 20 }}
                >
                  <XAxis dataKey="name" />
                  <Bar
                    dataKey="runs"
                    style={{
                      fill: "hsl(var(--foreground))",
                      opacity: 0.9,
                    }}
                  >
                    {chartSummaryData.length <= 15 && (
                      <LabelList
                        dataKey="runs"
                        content={renderCustomizedLabel}
                      />
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
              <h2 className="text-2xl font-bold">There is no data to show!</h2>
              <p>Start adding runs to see data</p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default OverStats;
