/*
Copyright (c) 2025 Jhordany Rodriguez Parra.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify, merge, publish, 
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following condition:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/


let my_mathematical_filters = [">=", "<=","<",">","==","!="];
let myfunctions =[(x,y)=> x>=y
                ,(x,y)=> x<=y
                ,(x,y)=> x<y
                ,(x,y)=> x>y
                ,(x,y)=> x==y
                ,(x,y)=> x!=y];
const inQuotesRegex = new RegExp("\".+\"");


/**
 * 
 * @param {RPTable} my_table 
 * @param {String} filter_value 
 * @param {String} column
 */
function apply_numeric_filter(my_table, filter_value, column){
    let pass_result;
    
    for (let m =0; m < my_mathematical_filters.length; m++)
    {
        let mf = my_mathematical_filters[m];
        let my_function = myfunctions[m];
        console.log('will grab argument 1'+ mf);
        if (filter_value.indexOf(mf) ==0){
            console.log('will grab argument '+ mf);
            let argument = parseFloat(filter_value.replace(mf,''));
            console.log('argument is '+ argument);
            if (!isNaN(argument)){
                console.log('will do it WITH '+ mf);
                pass_result  = my_table.data.map((x)=> my_function(x[column],argument));
            }
            else
            {
                pass_result  = my_table.data.map((x)=> x[column].toString().indexOf(filter_value)>=0);        
            }

            return pass_result;
        }
    }
    if (filter_value.indexOf("=")==0){
        alert("Warning, detected equality operator in filter. If you intend to check for numerical equality use ==");
        
    }
    pass_result  = my_table.data.map((x)=> x[column].toString().indexOf(filter_value)>=0);
    return pass_result;
}



/**
 * @param {RPTable} my_table
 * @param {int} timeout 
 * @param {function} event_handler (target, current run)
 * @returns 
 */
function get_edit_listener_filters(my_table, timeout, event_handler){
    return (event)=>{
        let previous_attribute = event.target.getAttribute('current_runs');
        previous_attribute = parseInt(previous_attribute);
        let my_run   = previous_attribute+1;
        event.target.setAttribute("current_runs", my_run);
        setTimeout(event_handler, 
                   timeout,
                   my_table,
                   event.target,
                   my_run);
    // console.log(event.target);
    }
}




/**
     * This function gets called when a filter box is being  edited.
     * @param {RPTable} my_table 
     * @param {HTMLElement} target 
     * @param {int} current_runs used to detect whether the user kept typing
     */
function filter_action(my_table, target, current_runs)
{
    let updated = target.getAttribute('current_runs');
    updated = parseInt(updated);
    // after the given time no new updates
    if (updated == current_runs)
    {
        let column = target.getAttribute('column_name');
        let filter_value = target.value;
        // get the list of boolean values where 1 indicates
        // that the object passes the filter
        const my_column_index = my_table.columnNames.findIndex(x=>x==column);
        console.log('applying filter to column '+ column + '(index '+my_column_index +') with value '+ target.value);

        let pass_result;
        if (my_table.columnsInfo[my_column_index].type == "number")
        {
            pass_result = apply_numeric_filter(my_table, filter_value, column);
        }
        else if (filter_value[0]=='"' && filter_value.at(-1)=='"')
        {
            let newFilterValue = filter_value.slice(1,-1);
            console.log('new filter value '+ newFilterValue);
            pass_result  = my_table.data.map((x)=> x[column] == newFilterValue);
        }
        else
        {
            pass_result  = my_table.data.map((x)=> x[column].indexOf(filter_value)>=0);
        }
        // update the general filter function call.                               
        for (let i =0; i < pass_result.length; i ++)
        {
            my_table.html_mirror[i].filterStatus[my_column_index].status = pass_result[i];
        }
        // general display 
        let to_make_visible = [];
        let total_shown = 0;
        for (let i = 0; i < my_table.html_mirror.length; i ++)
        {
            let new_display = my_table.html_mirror[i].passes_filters();
            let displayed_before = my_table.html_mirror[i].display==true;
            //my_table.html_mirror[i].display =new_display;
            if (total_shown < my_table.rowsPerPage)
            {    
                // set to true if no filter has status set to false.
                if (displayed_before == false && new_display == true)
                {
                    my_table.html_mirror[i].display= true;
                    to_make_visible.push(i);
                    total_shown+=1;
                }
                // was visible and remains visible
                if (displayed_before == true && new_display)
                {
                    total_shown +=1;
                }
            }
            // was visible before and now has to be set to not visible
            if (displayed_before == true && new_display == false)
            {
                    my_table.html_mirror[i].make_invisible();
            }
            // was visible and should remain visible, but there are already the maximum number of rows visible    
            if (displayed_before == true && new_display == true && total_shown >= my_table.rowsPerPage)
            {
                my_table.html_mirror[i].make_invisible();
            }
        }
    
        // make visible again
        my_table.make_indices_visible(to_make_visible);
        target.setAttribute("current_runs",0);
        // call functions after content change. If the sorting module has added a
        // callback funcition, it will be called here.
        for (let cc =0; cc < my_table.onContentChangedCallBacks.length; cc++)
        {
            my_table.onContentChangedCallBacks[cc](my_table);
        }
    }
}


/**
 * main function
 * @param {RPTable} jrptable 
 */
function create_filters(jrptable){
     // we first create the cells
        jrptable.mirror_header = jrptable.HeaderDiv.tableHTML.createTHead()
        let mirror_header_row = jrptable.mirror_header.insertRow(0);
        let column_width = 100/jrptable.columnNames.length;
        for (let i =0; i < jrptable.columnNames.length; i ++){
            let mth = document.createElement('th');
            mth.classList.add('rptable_header');
            mth.innerHTML = jrptable.columnNames[i];            
            mth.id = jrptable.name +"__mheader__"+jrptable.columnNames[i];
            mth.style.width = column_width +'%';
            mirror_header_row.appendChild(mth);  
        }
        jrptable.filter_row =jrptable.mirror_header.insertRow(1);//this.header.insertRow(1);
        console.log('inserted row filter');
        let columns_to_filter = jrptable.columnNames.filter((x)=> x != undefined);
        for (let i =0; i < columns_to_filter.length; i ++)
        {
            var th = document.createElement('th');
            th.classList.add('rptable_filter');
            th.id = 'rptable_filter__'+columns_to_filter[i].replace(' ','_');
            jrptable.filter_row.appendChild(th);
        }
        for (let i =0; i< jrptable.filter_row.children.length; i++){
            console.log('adding');
            let my_input = addInputToCell(jrptable.filter_row.children[i], ["jrptable_input", "jrptable_filter"]);
            my_input.setAttribute('column_name', columns_to_filter[i]);
        }
        let get_edit_listener = get_edit_listener_filters(jrptable, 500, filter_action);
        jrptable.filter_row.addEventListener('input', get_edit_listener);
}

    /**
     * set the top of the filter based on how much space is being consumed
     * by the headers. At the moment we have 
     * top_filters = 2* height_headers_rect + 5 px
     */
function  set_filter_top()
 {
        // we get the bottom of the headers row
        let isChrome = navigator.userAgent.toLowerCase().indexOf('chrome')>=0;

        let headers = document.getElementsByClassName("rptable_header");
        if (headers != undefined && headers.length > 0){
            let first_header_bottom = headers[0].getBoundingClientRect().bottom;
            let first_header_top = headers[0].getBoundingClientRect().top;
            let new_top =  (first_header_bottom - first_header_top);
            if (isChrome == false){
                new_top = new_top*2 +3;
            }
            let filters = document.getElementsByClassName("rptable_filter");
            if (filters != undefined){
                for (let i=0; i < filters.length; i ++){
                    console.log('adjusting filters lenght '+ first_header_bottom);
                    filters[i].style.top = new_top+ "px";
                }
            }
        }
 }