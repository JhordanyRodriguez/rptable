/*
Copyright (c) 2025 Jhordany Rodriguez Parra.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify, merge, publish, 
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following condition:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/



/*
These Javascript classes can be used to create a html table
intended to be fast, responsive, and useful to observe data patterns.
refs: 
https://www.w3schools.com/jsref/dom_obj_table.asp 
*/


/**
 * creates an input A within a html table cell B. A.id will be
 * 'input_in__<B.id>'
 * @param {html} html_cell the html object (B) to which an input will be added.
 * @param {string} classes_to_apply A class that will be assigned to the inputs created
 */
function addInputToCell(html_cell, classes_to_apply){
    let my_input = document.createElement('input');
    classes_to_apply.forEach(x=> my_input.classList.add(x));
    //my_input.classList.add(class_to_apply);
    my_input.id = 'input_in__'+ html_cell.id;
    my_input.setAttribute('current_runs',0);
    html_cell.appendChild(my_input);
    return my_input;
}

let RPTableData = class{
    /**
     * 
     * @param {html} html_row 
     */
    constructor(html_row, column_names, abs_index){
        this.row = html_row;
        this.status = 'created';
        // when creating it, if a row is passed, it means that it will be visible.
        this.display = html_row != null ? true: false;
        this.absIndex = abs_index;
        this.sortingIndex = abs_index;
        //filter status will be true if the object passess the filter
        this.filterStatus = Array.apply(column_names, Array(column_names.length))
                            .map(function(value, index)
                            {
                                return {"name": column_names[index],"status":true, "index":index}
                            });
        
    }

    passes_filters(){
        return this.filterStatus.findIndex((x)=> x.status==false) == -1;
    }

    make_invisible(){
        this.display = false;
        this.row.style.display = 'none';
    }

    make_visible(){
        this.row.style.display = "table-row";
        this.display = true;
    }
}

let RPTable = class{
    /**
     * Returns a table
     * @param {string} html_parent :string the name of the html object the table will be attached to.
     * @param {string} name name
     * @param {list(stirng)} unique_ids list of columns which values uniquely identify an object 
     */
    constructor(html_parent, name, unique_ids)
    {
        if (parent== undefined){
            alert("could not find the parent to create the table");
            return;
        } 
        else
        {
            this.rowsPerPage =10;
            this.bottomBy = 'last row'; // last row or fixed
            this.parent = document.getElementById(html_parent);
            this.HeaderDiv = document.createElement('div');
            this.HeaderDiv.style.position = 'fixed';
            this.uniqueIDs = unique_ids;
            // will have the scroll property
            this.tableContainer  = document.createElement('div');
            this.tableContainer.id = 'rptable_container_'+ name;
            this.tableContainer.classList.add('rptable_table_content_div');
            this.tableContainer.style.overflowY= 'scroll';
            // you can overwrite the rows per page.
            this.tableHTML = document.createElement('TABLE');
            this.HeaderDiv.tableHTML = document.createElement('TABLE');
            this.HeaderDiv.tableHTML.setAttribute('table-layout','fixed');
            this.HeaderDiv.appendChild(this.HeaderDiv.tableHTML);
            this.tableContainer.appendChild(this.tableHTML);
            this.tableHTML.id = 0;
            this.columnsInfo = [];
            this.tableHTML.classList.add('rptable_table');
            this.HeaderDiv.tableHTML.classList.add('rptable_table');
            this.header = null;
            this.parent.appendChild(this.HeaderDiv);
            this.parent.appendChild(this.tableContainer);
            // pagination
            this.paginationDiv = document.createElement('div');
            this.paginationDiv.classList.add('rptable_pag_div');
            let pag_button_left = document.createElement('button');
            this.paginationDiv.appendChild(pag_button_left);
            this.pagination_label = document.createElement('label');
            this.pagination_label.id = 'rptable_paglabel';
            this.textContent = '1';
            this.paginationDiv.appendChild(this.pagination_label);
            let pag_button_right = document.createElement('button');
            this.paginationDiv.appendChild(pag_button_right);
            pag_button_left.textContent = "<-"
            pag_button_right.textContent = "->"
            pag_button_left.addEventListener('click', ()=>this.changeView(true));
            pag_button_right.addEventListener('click', ()=>this.changeView(false));
            this.parent.appendChild(this.paginationDiv);

        }
        this.name = name;
        // function called after the view of the table is changed (due to sorting or scrolling)
        this.onViewChange = (x)=> console.log('Replace this function, it sends the table as a param');
        // function called after content is changed (e.g., due to filtering)
        let updatePag = ()=> '1/'+ parseInt(this.html_mirror.filter((y)=> y.passes_filters()).length/this.rowsPerPage);
        this.onContentChangedCallBacks = [(x) => this.pagination_label.textContent = updatePag()];
    };

    /**
     * sets the data that will be displayed by this instance.
     * @param {list[json]} data 
     */
    set_data(data)
    {
        this.data = data;
        this.columnNames = Object.keys(this.data[0]);
        this.columnsInfo = Array.apply(this.columnNames, Array(this.columnNames.length)).map(function(x,i){
                                                                                return {"index": i,
                                                                                        "name": x,
                                                                                        "type":"string",
                                                                                        "nextSorting":"asc"};
                                                                                    });
        let reduced_data = this.data.slice(0,600);                                                                           
        for (let c =0; c < this.columnNames.length; c ++){
            let this_column = this.columnNames[c];
            let no_number = reduced_data.findIndex((x)=> isNaN(parseFloat(x[this_column])));
            if (no_number == -1){
                this.columnsInfo[c].type = "number";   
            }
            this.columnsInfo[c].name = this.columnNames[c];
        }
        // simple array that will make it easier to map the filters results
        this.indices = Array.apply(null, Array(this.data.length)).map(function(x,i){return i;});
        // an array that will contain the order in which rows will be shown.
        this.ordered_indices = Array.apply(null, Array(this.data.length)).map(function(x,i){return i;});
        
    }

    /**
     * Creates the html structure of the headers to display the data.
     * maps every field of the first element in the list data
     * to a column, then displays the columns for each element
     * in the list data.
     * populates attributes: column_names, header
     * @param {list[json]} data 
     */
    create_headers()
    {        
        console.log(this.columnNames);
        this.header = this.tableHTML.createTHead();
        
        this.HeaderDiv.classList.add('rptable_header_mirror');
        let header_row = this.header.insertRow(0);
        let column_width = 100/this.columnNames.length;
        
        for (let i =0; i < this.columnNames.length; i ++){
            var th = document.createElement('th');
            //th.classList.add('rptable_header');
            th.textContent = this.columnNames[i];
            //th.innerHTML = this.columnNames[i];            
            //let td = header_row.insertCell();
            th.id = this.name +"__header__"+this.columnNames[i];
            header_row.appendChild(th);
            
        }
    }


    /**
     * creates an html row
     * @param {int} index_in_data the index within the original array 
     * of the data point we want to create the html row for
     */
    createDataRow(index_in_data){
        // where are we inserting it
        let data_row = this.tbody.insertRow();
        for (let f =0; f < this.columnNames.length; f++)
        {
            let td = data_row.insertCell();
            td.textContent = this.data[index_in_data][this.columnNames[f]];
            td.id = 'rptable_'+ this.name+'_at_'+index_in_data+'_for_'+ this.columnNames[f].replaceAll(' ', '_');
            td.setAttribute('colID', f);
            //td.setAttribute('row_idx', index_in_data);       
        }
        data_row.setAttribute('dindex', index_in_data);
        data_row.classList.add('rptable_row');
        return data_row;
    }

    get_current_view(){
        //return this.html_mirror.filter((x)=> x.is_visible() == true);
        return this.html_mirror.filter((x)=> x.display == true)
    }

    /**
     * 
     * @param {boolean} backwards 
     * @returns 
     */
    changeView(backwards){
        let current_view = this.get_current_view();
        if (current_view.length>0)
        {
            let last_index = current_view.at(-1).sortingIndex;
            let first_index = current_view.at(0).sortingIndex;
            let next_view = [];
            let passFilters = this.html_mirror.filter((x)=> x.passes_filters() == true);
            let total_views = parseInt(passFilters.length/ this.rowsPerPage)+1;
            let current_nview = 0;
            if (backwards == false)
            {
                // this filter could return when the number of this.rowsPerPage elements has been reached.
                next_view = passFilters.filter((x)=> x.sortingIndex > last_index);
                // they could not be sorted....
                next_view.sort((x,y)=> x.sortingIndex- y.sortingIndex);
                let records_out = passFilters.length - next_view.length;
                current_nview = parseInt(records_out/ this.rowsPerPage)+1;
                next_view = next_view.slice(0, this.rowsPerPage);
            }
            else
            {
                next_view = passFilters.filter((x)=> x.sortingIndex < first_index);
                next_view.sort((x,y)=> x.sortingIndex - y.sortingIndex);
                let records_out = next_view.length;
                current_nview = parseInt(records_out/this.rowsPerPage);
                next_view = next_view.slice(Math.max(next_view.length- this.rowsPerPage,0), next_view.length);
            }
            if (next_view.length ==0){
                alert('there is no more data');
                return;
            }
            for (let v =0; v< current_view.length; v++){
                current_view[v].make_invisible();
            }
            this.pagination_label.textContent = current_nview + '/' + total_views;
            console.log('first and last indices: '+ first_index + ' and '+ last_index);
            //console.log('next view is');
            //console.log(next_view);
            let to_make_visible = next_view.map((x)=> x.absIndex);
            console.log('to make visible ('+ to_make_visible.length +')');
            console.log(to_make_visible);
            this.make_indices_visible(to_make_visible);
            this.onViewChange(this);
            //? should we do the html swapping here?
        }
    }
    /**
     * It also creates attribute 'html_mirror'. Entry ith in html_mirror holds the 
     * html data corresponding to the ith entry in the original data. i.e, we have
     * a one to one index-based mapping between the original data and html_mirror
     */
    fill_data(){
        // create a placeholder element:
        this.html_mirror = Array.apply(null, Array(this.data.length)).map(function () {})
        // now we fill the data 
    
        this.tbody = document.createElement('tbody');
        this.tableHTML.appendChild(this.tbody);
        
        for (let i =0; i <this.data.length; i ++)
        {
            let data_row = null;
            if (i < this.rowsPerPage)
            {
                data_row = this.createDataRow(i);
            }
            // rows that will not be shown, data_row, will be set to null
            this.html_mirror[i] = new RPTableData(data_row, this.columnNames,i); 
        }
        
        this.my_top = this.tableHTML.getBoundingClientRect().top;
        setTimeout((x)=> this.re_adjust(), 100);
        window.addEventListener('resize', (x)=> this.re_adjust());
    }

    get_last_row_bottom(){
        let lastVisibleRow = this.html_mirror.filter((x)=> x.display == true);
        if (lastVisibleRow.length >0){
            let last = lastVisibleRow.at(-1).row;
            let theBottom = last.getBoundingClientRect().bottom;
            return theBottom;
            //window.dispatchEvent(new Event('resize'));
        }
        else{
            return null;
        }
    }

    re_adjust_with_last_row()
    {
        let bottom = this.get_last_row_bottom();
        if (bottom != null){
            this.paginationDiv.style.top = (bottom+20) + 'px';
        }
      
    }

    re_adjust(){
        if (this.bottomBy == 'last row'){
            this.re_adjust_with_last_row();
        }
        else
        {
            let new_top = this.parent.getBoundingClientRect().bottom +20;
            this.paginationDiv.style.top = new_top  +"px";
        }
    }

    /**
     * 
     * @param {Array} to_make_visible: list of absolute indices.
     */
    make_indices_visible(to_make_visible){
        for (let i =0;i< to_make_visible.length; i ++)
        {
            try
            {
                if (this.html_mirror[to_make_visible[i]].row == undefined)
                {
                    // need to create the data row
                    this.html_mirror[to_make_visible[i]].row = this.createDataRow(to_make_visible[i])
                } 
                this.html_mirror[to_make_visible[i]].make_visible();
                // the entry on html_mirror was set to true earlier
            }
            catch(err){
                console.log(err);
                console.log(to_make_visible[i]);
                break;
            }
        }
    }

    comparator_stringss(x,y, myta){
        console.log('these are x and y ');
        
        return 0;
    }

   

    
    show(){
        this.tableHTML.display='block';
    }
  
};