//https://www.w3schools.com/jsref/dom_obj_table.asp

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
        }
    };

    /**
     * Creates the html structure for the given data
     * maps every field of the first element in the list data
     * to a column, then displays the columns for each element
     * in the list data.
     * @param {json} data 
     */
    fill_data(data)
    {
        this.data = data;
        this.column_names = Object.keys(this.data[0]);
        console.log(this.column_names);
        var header = this.my_html.createTHead();
        let header_row = header.insertRow(0);
        
        for (let i =0; i < this.column_names.length; i ++){
            var th = document.createElement('th');
            th.classList.add('jtable_header');
            th.innerHTML = this.column_names[i];            
            //let td = header_row.insertCell();
            th.id = this.name +"__header__"+this.column_names;
            header_row.appendChild(th);
            //td.classList.add('jtable_header');
            //td.innerHTML = this.column_names[i];            
        }
        // now we fill the data 
        for (let i =0; i < this.data.length; i ++)
        {
            let data_row = this.my_html.insertRow();
            for (let f =0; f < this.column_names.length; f++)
            {
                let td = data_row.insertCell();
                td.innerHTML = this.data[i][this.column_names[f]];
            }
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

