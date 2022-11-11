import {createRef, useEffect, useRef, useState,useCallback} from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import "@progress/kendo-theme-material/dist/all.css";
import { process } from "@progress/kendo-data-query";
import { ColumnMenu, ColumnMenuCheckboxFilter,SearchMenu } from "./ColumnMenu";
import products from "./product.json";
import {
    IntlProvider,
    load,
    LocalizationProvider,
    loadMessages,
} from "@progress/kendo-react-intl";
import { useReactToPrint } from "react-to-print";
import { ExcelExport,ExcelExportColumn } from "@progress/kendo-react-excel-export";
import likelySubtags from "cldr-core/supplemental/likelySubtags.json";
import currencyData from "cldr-core/supplemental/currencyData.json";
import weekData from "cldr-core/supplemental/weekData.json";
import caGeneric from "cldr-dates-full/main/fa/ca-generic.json";
import caGregorian from "cldr-dates-full/main/fa/ca-gregorian.json";
import dateFields from "cldr-dates-full/main/fa/dateFields.json";
import timeZoneNames from "cldr-dates-full/main/fa/timeZoneNames.json";
import esMessages from "./fa-IR.json";

load(
    likelySubtags,
    currencyData,
    weekData,
    caGeneric,
    caGregorian,
    dateFields,
    timeZoneNames
);

loadMessages(esMessages, "fa-IR");



const createDataState = (dataState) => {
    let data=products.map((data)=>({...data,FirstOrderedOn:new Date(data.FirstOrderedOn)}))
    return {
        result: process(data.slice(0), dataState),
        dataState: dataState,
    };
};



const KendoGrid = () => {

    const [col,setCol]=useState(true)

    const printRef = useRef();
    const _export = useRef(null);
    const excelExport = () => {
        if (_export.current !== null) {
            _export.current.save();
        }
    };

    let initialState = createDataState({
        take: 8,
        skip: 0,
        // group:[{field:'ProductName'}]
    });
    const [result, setResult] = useState(initialState.result);
    const [dataState, setDataState] = useState(initialState.dataState);



    const dataStateChange = (event) => {
        let updatedState = createDataState(event.dataState);
        setResult(updatedState.result);
        setDataState(updatedState.dataState);
    };

    const reactToPrintContent = useCallback(() => {
        return printRef.current;
    }, [printRef.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: "AwesomeFileName",
        removeAfterPrint: true
    });




    return (
        <div style={{direction:'rtl'}}>
            <button type={"button"} onClick={handlePrint}>Print</button>
            نام:<input type={"checkbox"} onChange={()=>setCol(col=>!col)} checked={col}/>
            <hr/>
            <button
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                onClick={excelExport}
            >
                خروجی Excel
            </button>

            <LocalizationProvider language="fa-IR">
                <IntlProvider locale="fa-IR">
                        <ExcelExport
                            data={products}
                            ref={_export}
                            fileName="Products.xlsx"
                        >

                            <ExcelExportColumn field="ProductID" filterable={false} title="شماره" width="40px" />
                            <ExcelExportColumn field="ProductName" columnMenu={SearchMenu} title="نام" width="250px" hidden={col}/>
                            <ExcelExportColumn field="Category.CategoryName" title="نام دسته" columnMenu={ColumnMenuCheckboxFilter} />
                            <ExcelExportColumn field="FirstOrderedOn" columnMenu={ColumnMenu} filter="date" format="{0:d}" title="تاریخ اولین سفارش" />
                            <ExcelExportColumn field="UnitPrice" title="قیمت" filter={"numeric"} columnMenu={ColumnMenu} hidden={true} />
                            <ExcelExportColumn field="UnitsInStock" title="موجودی" filter={"numeric"} columnMenu={ColumnMenu} />
                        </ExcelExport>
                    <div >
                        <Grid
                            filterable={true}
                            total={Object.values(products).length}
                            data={result}
                            {...dataState}
                            onDataStateChange={dataStateChange}
                            sortable={true}
                            pageable={true}
                            pageSize={8}
                            reorderable={true}
                            ref={printRef}
                            // groupable={true}

                        >
                            <GridColumn field="ProductID" filterable={false} title="شماره" width="40px" hidden={true} />
                            {col&&<GridColumn field="ProductName" columnMenu={SearchMenu} title="نام" width="250px"/>}
                            <GridColumn field="Category.CategoryName" title="نام دسته" columnMenu={ColumnMenuCheckboxFilter} />
                            <GridColumn field="FirstOrderedOn" columnMenu={ColumnMenu} filter="date" format="{0:d}" title="تاریخ اولین سفارش" />
                            <GridColumn field="UnitPrice" title="قیمت" filter={"numeric"} columnMenu={ColumnMenu} />
                            <GridColumn field="UnitsInStock" title="موجودی" filter={"numeric"} columnMenu={ColumnMenu} />
                        </Grid>
                    </div>

                </IntlProvider>
            </LocalizationProvider>
        </div>

    );
};

export default KendoGrid
