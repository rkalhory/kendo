import * as React from 'react';
import { GridColumnMenuFilter, GridColumnMenuCheckboxFilter } from '@progress/kendo-react-grid';
import products from './product.json';

export const ColumnMenu = props => {
    return <div>
        <GridColumnMenuFilter {...props} expanded={true} />
    </div>;
};

export const ColumnMenuCheckboxFilter = props => {
    return <div>
        <GridColumnMenuCheckboxFilter {...props} data={products} expanded={true} />
    </div>;
};


export const ColumnMenuCustom = props => {
    console.log('ColumnMenuCustom:',props)
    let temp=products.map(item=>(item.ProductName==='Chai'&&item))
    temp=temp.filter(Boolean);


    console.log('temp:',temp)
    return <div>45</div>
};



let inputRef = "";

export const SearchMenu=(props)=> {


    const filterValue = () => {
        let filter = {
            field: "ProductName",
            operator: "contains",
            value: inputRef.value
        };
        props.onFilterChange({filters: [filter], logic: 'or'}, null);
        props.onCloseMenu();
    };
    const clearFilter = () => {
        props.onFilterChange(null, null);
        props.onCloseMenu();
    };

    return (
        <div style={{ padding: 10 }}>
            <input
                className="k-textbox"
                defaultValue={props.filter?props.filter.value : ""}
                ref={ref => (inputRef = ref)}
            />
            <br />
            <button className="k-button" onClick={filterValue}>
                Search
            </button>
            <button className="k-button" onClick={clearFilter}>
                Clear
            </button>
        </div>
    );
}
