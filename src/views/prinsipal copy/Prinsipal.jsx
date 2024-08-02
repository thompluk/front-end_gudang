import React from "react";
import TableCustom from "../../custom/Table.jsx";

export default function PrinsipalTest() {

  const columns = [
    {name: "ID", uid: "id", sortable: true},
    {name: "NAME", uid: "name", sortable: true},
    {name: "TELEPHONE", uid: "telephone", sortable: true},
    {name: "FAX", uid: "fax", sortable: true},
    {name: "ACTIONS", uid: "actions", headerClassName:'text-end'},
  ];

  const apiname = "prinsipal";
  const pathname = "prinsipal";

  return (
    <div className="flex-col justify-center bg-white p-4 rounded-large animated fadeInDown ">
      <div className="flex justify-between items-center pb-2" style={{ borderBottom: '1px solid grey' }}>
          <h1>Prinsipal List</h1>
      </div>
      <TableCustom columns={columns} apiname={apiname} pathname={pathname} isHidden={false}>
      </TableCustom>
    </div>
  );
}
