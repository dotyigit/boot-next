import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import CreateEntryForm from "./form";
import fetchData from "@/lib/fetch";

export default async function EntriesPage() {
  const { data } = await fetchData("/entries", "entries");
  return (
    <>
      <h1 className="text-3xl font-bold">Entries</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:order-2 md:col-span-1">
          <CreateEntryForm />
        </div>
        <div className="md:order-1 md:col-span-2">
          <DataTable
            filterColumn="title"
            filterPlaceholder="Search by title"
            columns={columns}
            data={data.entries}
          />
        </div>
      </div>
    </>
  );
}
