
let my_mathematical_filters = [">=", "<=","<",">","==","!="];
let myfunctions =[(x,y)=> x>=y
                ,(x,y)=> x<=y
                ,(x,y)=> x<y
                ,(x,y)=> x>y
                ,(x,y)=> x==y
                ,(x,y)=> x!=y];


/**
 * 
 * @param {JrpTable} my_table 
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
 * @param {JrpTable} my_table
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
     * @param {JrpTable} my_table 
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
        const my_column_index = my_table.column_names.findIndex(x=>x==column);
        console.log('applying filter to column '+ column + '(index '+my_column_index +') with value '+ target.value);

        let pass_result;
        if (my_table.columns_info[my_column_index].type == "number")
        {
            pass_result = apply_numeric_filter(my_table, filter_value, column);
        }
        else
        {
            pass_result  = my_table.data.map((x)=> x[column].indexOf(filter_value)>=0);
        }
                                        
        for (let i =0; i < pass_result.length; i ++)
        {
            my_table.html_mirror[i].filter_status[my_column_index].status = pass_result[i];
        }
        // general display 
        let to_make_visible = [];
        let total_shown = 0;
        for (let i = 0; i < my_table.html_mirror.length; i ++)
        {
            let displayed_before = my_table.html_mirror[i].display;
            // set to true if no filter has status set to false.
            my_table.html_mirror[i].display = my_table.html_mirror[i].filter_status.find((x)=> x['status']== false)== undefined;
            if (displayed_before == false && my_table.html_mirror[i].display == true)
            {
                to_make_visible.push(i);
            }
            // was visible before and now has to be set to not visible
            if (my_table.html_mirror[i].row != undefined && my_table.html_mirror[i].display == false)
            {
                my_table.html_mirror[i].row.style.display = 'none';
            }

        }
        // how many are visible? 

        // make visible again
        for (let i =0;i< to_make_visible.length; i ++)
        {
            try{
                if (my_table.html_mirror[to_make_visible[i]].row != undefined)
                {
                    my_table.html_mirror[to_make_visible[i]].row.style.display = "table-row";
                }
            }
            catch(err){
                console.log(err);
                console.log(to_make_visible[i]);
                break;
            }
        }
        target.setAttribute("current_runs",0);
        
        /*
        let original_states = Array.apply(null,
                                          Array(my_table.data.length)).map(function(x,i)
                                          {return my_table.html_mirror[i].display});
        
        // the ith entry will be True if the ith data element passes all the other filters.
        // we do this to prevent rows passing the current test but that fail another filter from
        // becoming visible again                                 
        let other_filters = Array.apply(null, Array(my_table.data.length)).map(function(v,i)
                                {
                                  const active_filter = my_table.html_mirror[i].filter_status.find(x=>x.status == false
                                                                                                   && x.index != my_column_index)
                                  return active_filter == undefined
                                });
        
        // those rows which result disagrees with its current state. 
        let changes_required = Array.apply(original_states,
                                           Array(my_table.data.length)).map(function(x,i)
                                           {
                                               return original_states[i] != pass_result[i]
                                           });
        
       
        // actual changes to the dom.
        let false_indices = my_table.indices.filter((x)=> pass_result[x]== false && changes_required[x]==true);
        // all the entries that this filter caused them to be 0                                   
        console.log(original_states);
        for (let i =0; i < false_indices.length; i ++)
        {
            my_table.html_mirror[false_indices[i]].row.style.display ="none";
            my_table.html_mirror[false_indices[i]].display = false;
            console.log('changing to false');
        }  
        // bring back to view previously hidden rows
        let new_visible = 0;
        for (let i =0; i < pass_result.length; i ++){
            if (pass_result[i] == true)
            {
                my_table.html_mirror[i].filter_status[my_column_index].status = true;

                if (new_visible <= my_table.rows_per_page)
                {
                    // if html_mirror has a null , we need to create the row
                    // data_row has to be assigned:
                    if (my_table.html_mirror[i].row == null)
                    {
                        my_table.html_mirror[i].row = my_table.create_data_row(i);
                    }

                    if (other_filters[i]== true)
                    {
                        // general display will only be true if the other filters agree
                        my_table.html_mirror[i].display = true;
                        my_table.html_mirror[i].row.style.display ="table-row";
                    }
                    new_visible = new_visible +1;
                }
            }
        }
        */
    }
}




/**
 * main function
 * @param {JrpTable} jrptable 
 */
function create_filters(jrptable){
     // we first create the cells
        jrptable.mirror_header = jrptable.header_div.my_html.createTHead()
        let mirror_header_row = jrptable.mirror_header.insertRow(0);
        let column_width = 100/jrptable.column_names.length;
        for (let i =0; i < jrptable.column_names.length; i ++){
            let mth = document.createElement('th');
            mth.classList.add('jrptable_header');
            mth.innerHTML = jrptable.column_names[i];            
            mth.id = jrptable.name +"__mheader__"+jrptable.column_names[i];
            mth.style.width = column_width +'%';
            mirror_header_row.appendChild(mth);  
        }
        jrptable.filter_row =jrptable.mirror_header.insertRow(1);//this.header.insertRow(1);
        console.log('inserted row filter');
        let columns_to_filter = jrptable.column_names.filter((x)=> x != undefined);
        for (let i =0; i < columns_to_filter.length; i ++)
        {
            var th = document.createElement('th');
            th.classList.add('jrptable_filter');
            th.id = 'jrptable_filter__'+columns_to_filter[i].replace(' ','_');
            jrptable.filter_row.appendChild(th);
        }
        for (let i =0; i< jrptable.filter_row.children.length; i++){
            console.log('adding');
            let my_input = add_input_to_cell(jrptable.filter_row.children[i], ["jrptable_input", "jrptable_filter"]);
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

        let headers = document.getElementsByClassName("jrptable_header");
        if (headers != undefined && headers.length > 0){
            let first_header_bottom = headers[0].getBoundingClientRect().bottom;
            let first_header_top = headers[0].getBoundingClientRect().top;
            let new_top =  (first_header_bottom - first_header_top);
            if (isChrome == false){
                new_top = new_top*2 +3;
            }
            let filters = document.getElementsByClassName("jrptable_filter");
            if (filters != undefined){
                for (let i=0; i < filters.length; i ++){
                    console.log('adjusting filters lenght '+ first_header_bottom);
                    filters[i].style.top = new_top+ "px";
                }
            }
        }
 }
