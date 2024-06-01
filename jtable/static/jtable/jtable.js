//https://www.w3schools.com/jsref/dom_obj_table.asp
/**
 * creates an input with id 'input_in__x' where x is id of html_cell
 * @param {html} html_cell the html object to which an input will be added.
 * @param {string} classes_to_apply A class that will be assigned to the inputs created
 */
function add_input_to_cell(html_cell, classes_to_apply){
    let my_input = document.createElement('input');
    classes_to_apply.forEach(x=> my_input.classList.add(x));
    //my_input.classList.add(class_to_apply);
    my_input.id = 'input_in__'+ html_cell.id;
    my_input.setAttribute('current_runs',0);
    html_cell.appendChild(my_input);
    return my_input;
}

/**
 * 
 * @param {JTable} my_table 
 * @param {String} filter_value 
 * @param {String} column
 */
function apply_numeric_filter(my_table, filter_value, column){
    let pass_result;
    let my_mathematical_filters = [">=", "<=","<",">","==","!="];
    let myfunctions =[(x,y)=> x>=y
                     ,(x,y)=> x<=y
                     ,(x,y)=> x<y
                     ,(x,y)=> x>y
                     ,(x,y)=> x==y
                     ,(x,y)=> x!=y];
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
 * @param {jtable} my_table
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
        setTimeout(event_handler,  timeout,my_table, event.target, my_run);
    // console.log(event.target);
    }
}

let JTableData = class{
    /**
     * 
     * @param {html} html_row 
     */
    constructor(html_row, column_names){
        this.row = html_row;
        this.status = 'created';
        this.display = html_row != null ? true: false;
        //filter status will be true if the object is visible
        this.filter_status = Array.apply(column_names, Array(column_names.length))
                            .map(function(value, index, column_namesi)
                            {
                                //console.log(column_names);
                                //console.log(value);
                                return {"name": column_names[index],"status":true, "index":index}
                            });
        
    }

}

let JTable = class{
    /**
     * Returns a table
     * @param {string} html_parent :string the name of the html object the table will be attached to.
     * @param {string} name name
     */
    constructor(html_parent, name){
        if (parent== undefined){
            alert("could not find the parent to create the table");
            return;
        } 
        else
        {
            this.parent = document.getElementById(html_parent);
            this.header_div = document.createElement('div');
            this.header_div.style.position = 'fixed';
            //this.header_div.textContent= 'holaaa';
            this.table_container  = document.createElement('div');
            this.table_container.classList.add('jtable_table_content_div');

            this.table_container.style.overflowY= 'scroll';
            this.rows_per_page =60;
            this.my_html = document.createElement('TABLE');
            this.header_div.my_html = document.createElement('TABLE');
            this.header_div.my_html.setAttribute('table-layout','fixed');
            this.header_div.appendChild(this.header_div.my_html);
            this.table_container.appendChild(this.my_html);
            this.my_html.id = 0;
            this.columns_info = [];
            this.my_html.classList.add('jtable_table');
            this.header_div.my_html.classList.add('jtable_table');
            this.header = null;
            this.parent.appendChild(this.header_div);
            this.parent.appendChild(this.table_container);
        }
        this.name = name;
        
    };

    /**
     * sets the data that will be displayed by this instance.
     * @param {list[json]} data 
     */
    set_data(data){
        this.data = data;
        this.column_names = Object.keys(this.data[0]);
        this.columns_info = Array.apply(this.column_names, Array(this.column_names.length)).map(function(x,i){
                                                                                return {"index": i,
                                                                                        "name": x,
                                                                                        "type":"string"};
                                                                                    });
        let reduced_data = this.data.splice(0,500);                                                                           
        for (let c =0; c < this.column_names.length; c ++){
            let this_column = this.column_names[c];
            let no_number = reduced_data.findIndex((x)=> isNaN(parseFloat(x[this_column])));
            if (no_number == -1){
                this.columns_info[c].type = "number";   
            }
            this.columns_info[c].name = this.column_names[c];
        }
        // simple array that will make it easier to map the filters results
        this.indices = Array.apply(null, Array(this.data.length)).map(function(x,i){return i;});
        // an array that will contain the order in which rows will be shown.
        this.ordered_indeces = Array.apply(null, Array(this.data.length)).map(function(x,i){return i;});
        
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
        
        console.log(this.column_names);
        this.header = this.my_html.createTHead();
        this.mirror_header = this.header_div.my_html.createTHead()
        this.header_div.classList.add('jtable_header_mirror');
        let header_row = this.header.insertRow(0);
        let mirror_header_row = this.mirror_header.insertRow(0);
        let column_width = 100/this.column_names.length;
        
        for (let i =0; i < this.column_names.length; i ++){
            var th = document.createElement('th');
            let mth = document.createElement('th');
            th.classList.add('jtable_header');
            mth.classList.add('jtable_header');
            th.innerHTML = this.column_names[i];            
            mth.innerHTML = this.column_names[i];            
            //let td = header_row.insertCell();
            th.id = this.name +"__header__"+this.column_names[i];
            mth.id = this.name +"__mheader__"+this.column_names[i];
            mth.style.width = column_width +'%';
            header_row.appendChild(th);
            mirror_header_row.appendChild(mth);  
        }

        
    }

    /**
     * set the top of the filter based on how much space is being consumed
     * by the headers. At the moment we have 
     * top_filters = 2* height_headers_rect + 5 px
     */
    set_filter_top(){
        // we get the bottom of the headers row
        let isChrome = navigator.userAgent.toLowerCase().indexOf('chrome')>=0;

        let headers = document.getElementsByClassName("jtable_header");
        if (headers != undefined && headers.length > 0){
            let first_header_bottom = headers[0].getBoundingClientRect().bottom;
            let first_header_top = headers[0].getBoundingClientRect().top;
            let new_top =  (first_header_bottom - first_header_top);
            if (isChrome == false){
                new_top = new_top*2 +3;
            }
            let filters = document.getElementsByClassName("jtable_filter");
            if (filters != undefined){
                for (let i=0; i < filters.length; i ++){
                    console.log('adjusting filters lenght '+ first_header_bottom);
                    filters[i].style.top = new_top+ "px";
                }
            }
        }
    }

    /**
     * This function gets called when a filter box is being  edited.
     * @param {JTable} my_table 
     * @param {*} target 
     * @param {*} current_runs 
     */
    filter_action(my_table, target, current_runs){
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
            if (my_table.columns_info[my_column_index].type == "number"){
                pass_result = apply_numeric_filter(my_table, filter_value, column);
            }
            else{
                pass_result  = my_table.data.map((x)=> x[column].indexOf(filter_value)>=0);
            }
            console.log('pass values');
            console.log(pass_result);
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
            /*
            console.log('pass results');
            console.log(pass_result);
            console.log('original states');
            console.log(original_states);
            console.log('other filters');
            console.log(other_filters);
            console.log('changes required ');
            console.log(changes_required);
            */
           
            // even if they were not being display before, they should have their filter status set to zero
            let this_filter_false = my_table.indices.filter((x)=> pass_result[x]== false);
            for (let i =0; i < this_filter_false.length; i ++){
                my_table.html_mirror[this_filter_false[i]].filter_status[my_column_index].status = false;
            }
            let false_indices = my_table.indices.filter((x)=> pass_result[x]== false && changes_required[x]==true);
            // all the entries that this filter caused them to be 0                                   
            console.log(original_states);
            for (let i =0; i < false_indices.length; i ++){
                my_table.html_mirror[false_indices[i]].row.style.display ="none";
                my_table.html_mirror[false_indices[i]].display = false;
                console.log('changing to false');
            }  
            // bring back to view previously hidden rows
            for (let i =0; i < pass_result.length; i ++){
                if (pass_result[i] == true)
                {
                    // if html_mirror has a null , we need to create the row
                    // data_row has to be assigned:
                    if (my_table.html_mirror[i].row == null)
                    {
                        // mytable or this?
                        //console.log('this is this');
                        //console.log(this);
                        let data_row = my_table.my_html.insertRow();
                        for (let f =0; f < my_table.column_names.length; f++)
                        {
                            let td = data_row.insertCell();
                            td.innerHTML = my_table.data[i][my_table.column_names[f]];                
                        }
                        my_table.html_mirror[i].row = data_row;
                    
                    }

                    my_table.html_mirror[i].filter_status[my_column_index].status = true;
                    if (other_filters[i]== true)
                    {
                        // general display will only be true if the other filters agree
                        my_table.html_mirror[i].display = true;
                        my_table.html_mirror[i].row.style.display ="table-row";
                    }
                }
            }
            
            target.setAttribute("current_runs",0);
        }
    }

    create_filters()
    {
        // we first create the cells
        this.filter_row =this.mirror_header.insertRow(1);//this.header.insertRow(1);
        console.log('inserted row filter');
        let columns_to_filter = this.column_names.filter((x)=> x != undefined);
        for (let i =0; i < columns_to_filter.length; i ++)
        {
            var th = document.createElement('th');
            th.classList.add('jtable_filter');
            //th.innerHTML = this.column_names[i];
            th.id = 'jtable_filter__'+columns_to_filter[i].replace(' ','_');
            this.filter_row.appendChild(th);
        }
        for (let i =0; i< this.filter_row.children.length; i++){
            console.log('adding');
            let my_input = add_input_to_cell(this.filter_row.children[i], ["jtable_input", "jtable_filter"]);
            my_input.setAttribute('column_name', columns_to_filter[i]);
        }
        console.log('before');
        console.log(this);
        let get_edit_listener = get_edit_listener_filters(this, 500, this.filter_action);
        this.filter_row.addEventListener('input', get_edit_listener);
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
        //let reduced_data = this.data.splice(0, this.rows_per_page);
        for (let i =0; i <this.data.length; i ++)
        {
            let data_row = null;
            if (i < this.rows_per_page)
            {
                data_row = this.my_html.insertRow();
                for (let f =0; f < this.column_names.length; f++)
                {
                    let td = data_row.insertCell();
                    td.innerHTML = this.data[i][this.column_names[f]];                
                }
            }
            this.html_mirror[i] = new JTableData(data_row, this.column_names); 
        }
        this.my_top = my_table.my_html.getBoundingClientRect().top;
    }

    comparator_stringss(x,y, myta){
        console.log('these are x and y ');
        
        return 0;
    }
    compare_strings(x,y){
        //console.log('comparing ');
        if (x<y){
            return -1;
        }
        else if(x>y){
            return 1;
        }
        else{
            return 0;
        }
    }

  

    obtain_sorter(column_name, column_index){
        
        let column_info = this.columns_info[column_index];
        console.log('this is the column info ');
        console.log(column_info);
        let before_ordering = [...this.ordered_indeces];

        let comparing_strings= (x,y)=> this.compare_strings(this.data[x][column_name],
                                                            this.data[y][column_name]);
        //this.ordered_indeces.sort((x,y)=> this.comparator_strings(x,y, this));
        this.ordered_indeces.sort((x,y)=> comparing_strings(x,y));
        console.log('this is the new order');
        console.log(this.ordered_indeces);
        console.log('this is the previous ');
        console.log(before_ordering);
        let parent_node = my_table.html_mirror[10].row.parentNode;
        //every time there is a swap, the previous indixes get pushed one down.
        // e.g if 6 is the first element now, we have 
        // 6,0,1,2,3 ... the second entry will need to be compared swapped with 0, not 1
        let n_swaps =0;
        // only do the elements in the current page.
        for (let i =0; i < this.ordered_indeces.length; i ++){
            if (this.ordered_indeces[i] != before_ordering[i-n_swaps] | 4>3)
            {
                console.log('will swap  '+ this.ordered_indeces[i] + ' with '+ before_ordering[i]);
                parent_node.insertBefore(this.html_mirror[this.ordered_indeces[i]].row,
                                         this.html_mirror[before_ordering[i-n_swaps]].row)
                n_swaps++;
                // were was the first in the previous?
                /*
                if (i >1){
                    break;
                }
                */
            }
           // this.html_mirror[i].row.insertBefore()
        }
       
        
    }

    my_sorter(column_name){
        alert(' will sort '+ column_name);
    }
    
    

    create_sorters(){
        let sortable_columns = this.column_names.filter((x)=> x != undefined);
        for (let i =0; i < sortable_columns.length; i ++)
        {
            let icolumn_name = this.column_names[i].replace(' ','_');
            let _sorter_id = this.name +"__header__"+icolumn_name;
            // this sorted id will need to refer to the newly created header_div
            let _header = document.getElementById(_sorter_id);
            if (_header != undefined){
                console.log('adding click listener to '+ _sorter_id);
                //_header.addEventListener('click', this.obtain_sorter(icolumn_name));
                _header.addEventListener('click',
                                         (e)=> this.obtain_sorter(icolumn_name, i));
            }
            else{
                console.log('could not find header with id '+ _sorter_id);
            }
            
        }
    }



    show(){
        this.my_html.display='block';
    }

    add_column_header_listeners(){
        for(let i =0; i <this.column_names; i ++){

        }
    }
};

