export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="إجمالي المنتجات" value="124" />
                <StatCard title="إجمالي الطلبات" value="45" />
                <StatCard title="الأرباح" value="1,234 د.ع" />
            </div>

            <div className="mt-12 p-8 border border-zinc-800 rounded-xl bg-zinc-900/50 flex flex-col items-center justify-center text-center min-h-[300px]">
                <h3 className="text-xl font-bold mb-2">إدارة متجرك</h3>
                <p className="text-zinc-500 max-w-md mb-6">اختر "المنتجات" من القائمة الجانبية للبدء في إضافة أو تعديل أو حذف العناصر من الكتالوج الخاص بك.</p>
            </div>
        </div>
    )
}

function StatCard({ title, value }: any) {
    return (
        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-500 mb-2">{title}</h3>
            <div className="text-3xl font-bold">{value}</div>
        </div>
    )
}
