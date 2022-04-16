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
}

function filter_action(target, current_runs){
    let updated = target.getAttribute('current_runs');
    updated = parseInt(updated);
    // after the given time no new updates
    if (updated == current_runs){
        console.log('running');
        console.log(target.value);
        target.setAttribute("current_runs",0);
    }
    /*
    else{
        console.log('no running '+ updated + " and "+ current_runs);
    }
    */
}

/**
 * 
 * @param {int} timeout 
 * @param {function} event_handler (target, current run)
 * @returns 
 */
function get_edit_listener_filters(timeout, event_handler){
    return (event)=>{
        let previous_attribute = event.target.getAttribute('current_runs');
        previous_attribute = parseInt(previous_attribute);
        let my_run   = previous_attribute+1;
        event.target.setAttribute("current_runs", my_run);
        setTimeout(event_handler, timeout, event.target, my_run);
    // console.log(event.target);
    }
}

let JTableData = class{
    /**
     * 
     * @param {html} html_row 
     */
    constructor(html_row){
        this.row = html_row;
        this.status = 'created';
    }

}

let JTable = class{
    /**
     * Returns a table
     * @param {string} html_parent :string the name of the html object the table will be attached to.
     * @param {string} name name
     */
    constructor(html_parent, name){
        let parent = document.getElementById(html_parent);
        this.rows_per_page =60;
        if (parent== undefined){
            alert("could not find the parent to create the table");
        } 
        else
        {
            this.my_html = document.createElement('TABLE');
            parent.appendChild(this.my_html);
            this.my_html.id = 0;
            this.column_headers = [];
            this.my_html.classList.add('jtable_table');
            this.header = null;
        }
    };

    /**
     * sets the data that will be displayed by this instance.
     * @param {list[json]} data 
     */
    set_data(data){
        this.data = data;
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
        this.column_names = Object.keys(this.data[0]);
        console.log(this.column_names);
        this.header = this.my_html.createTHead();
        let header_row = this.header.insertRow(0);
        
        for (let i =0; i < this.column_names.length; i ++){
            var th = document.createElement('th');
            th.classList.add('jtable_header');
            th.innerHTML = this.column_names[i];            
            //let td = header_row.insertCell();
            th.id = this.name +"__header__"+this.column_names;
            header_row.appendChild(th);          
        }
    }

    /**
     * set the top of the filter based on how much space is being consumed
     * by the headers. At the moment we have 
     * top_filters = 2* height_headers_rect + 5 px
     */
    set_filter_top(){
        // we get the bottom of the headers row
        let headers = document.getElementsByClassName("jtable_header");
        if (headers != undefined && headers.length > 0){
            let first_header_bottom = headers[0].getBoundingClientRect().bottom;
            let first_header_top = headers[0].getBoundingClientRect().top;
            let new_top = (first_header_bottom - first_header_top)*2 +3;
            let filters = document.getElementsByClassName("jtable_filter");
            if (filters != undefined){
                for (let i=0; i < filters.length; i ++){
                    console.log('adjusting filters lenght '+ first_header_bottom);
                    filters[i].style.top = new_top+ "px";
                }
            }
        }
    }

    create_filters()
    {
        // we first create the cells
        this.filter_row =this.header.insertRow(1);
        console.log('inserted row filter');
        for (let i =0; i < this.column_names.length; i ++)
        {
            var th = document.createElement('th');
            th.classList.add('jtable_filter');
            //th.innerHTML = this.column_names[i];
            th.id = 'jtable_filter__'+this.column_names[i].replace(' ','_');
            this.filter_row.appendChild(th);
        }
        for (let i =0; i< this.filter_row.children.length; i++){
            console.log('adding');
            add_input_to_cell(this.filter_row.children[i], ["jtable_input", "jtable_filter"]);
        }
        let get_edit_listener = get_edit_listener_filters(500, filter_action);
        this.filter_row.addEventListener('input', get_edit_listener);
    }


    /**
     * It also creates attribute 'html_mirror'. Entry ith in html_mirror holds the 
     * html data corresponding to the ith entry in the original data
     */
    fill_data(){
        // create a placeholder element:
        this.html_mirror = Array.apply(null, Array(this.data.length)).map(function () {})
        // now we fill the data 
        for (let i =0; i < this.data.length; i ++)
        {
            let data_row = this.my_html.insertRow();
            for (let f =0; f < this.column_names.length; f++)
            {
                let td = data_row.insertCell();
                td.innerHTML = this.data[i][this.column_names[f]];                
            }
            this.html_mirror[i] = new JTableData(data_row); 
        }
        this.my_top = my_table.my_html.getBoundingClientRect().top;
    }



    show(){
        this.my_html.display='block';
    }

    add_column_header_listeners(){
        for(let i =0; i <this.column_names; i ++){

        }
    }
};

