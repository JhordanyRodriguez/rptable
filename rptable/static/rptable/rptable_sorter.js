/*
Copyright (c) 2025 Jhordany Rodriguez Parra.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify, merge, publish, 
distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following condition:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

let get_abs_index = (x)=> x.absIndex;

function compare_strings(x,y){
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
let comparing_strings_from_indices = (data,col,i,j)=> compare_strings(data[i][col],
                                                                      data[j][col]);

/**
 * Moves the html elements on view based on the sorting_index of each data element.
 * @param {RpTable} rp_table 
 */
function sort_html_elements_in_view(rp_table)
{
    let current_view = rp_table.get_current_view();
    current_view.sort((x,y)=> x.sortingIndex - y.sortingIndex);
    let current_view_idx = current_view.map((x)=> x.absIndex);
    let built_rows = document.getElementsByClassName('rptable_row');
    built_rows = Array.apply((x)=>x, built_rows);
    let visible_rows = built_rows.filter((x)=> current_view_idx.includes(parseInt(x.getAttribute('dindex'))));
    let current_view_html_ordering = Array.apply(null, visible_rows).map((x)=> parseInt(x.getAttribute('dindex')));
    let current_view_ideal_ordering = current_view.map((x)=> x.absIndex);

    //return visible_rows;
    let parent_node = visible_rows[0].parentNode;
    if (current_view_html_ordering.length != current_view_ideal_ordering.length){
        alert('lists do not coincide in length');
        return;
    }
    // the position in the current vector that will be swapped.
    let change_happened = -1;
    let ideals_moved = [];
    for (let i =0; i < current_view_html_ordering.length; i ++)
    {
        if (change_happened == -1 && (current_view_html_ordering[i] != current_view_ideal_ordering[i]))
        {
            change_happened = i;
            /*
            console.log('current');
            console.log(current_view_html_ordering);
            console.log('ideal');
            console.log(current_view_ideal_ordering);
            console.log('putting ' +  current_view_ideal_ordering[i] + ' before '+ current_view_html_ordering[i] );
            */
            parent_node.insertBefore(rp_table.html_mirror[current_view_ideal_ordering[i]].row,
                                     rp_table.html_mirror[current_view_html_ordering[i]].row);
            for (let j=0; j <= i;j++){
                ideals_moved.push(current_view_ideal_ordering[j]);
            }
            continue;
        }
        // a movement occurred
        if (change_happened != -1)
        {
            // if swapping already started, we keep moving items before the given number
            // unless this new number is the same as the one in the current position
            if (current_view_html_ordering[change_happened] == current_view_ideal_ordering[i])
            {
                ideals_moved.push(current_view_ideal_ordering[i]);
                console.log('i is '+ i);
                console.log('just pushing '+ current_view_ideal_ordering[i]);
                console.log('old change_happened '+ current_view_html_ordering[change_happened]+ 'in '+ change_happened);
                change_happened = current_view_html_ordering.findIndex((x)=> ideals_moved.includes(x)== false);
                console.log('New change_happened '+ current_view_html_ordering[change_happened] + 'in '+ change_happened)
            }
            else
            {
                // we will search the first not moved 
                let fnm = current_view_html_ordering.findIndex((x)=> ideals_moved.includes(x)== false);
                change_happened = fnm;
                //console.log('the first not moved element is index '+ fnm + ' with '+ current_view_html_ordering[fnm]);
                //console.log('moving ' + current_view_ideal_ordering[i] + ' above ' +current_view_html_ordering[change_happened])
                parent_node.insertBefore(rp_table.html_mirror[current_view_ideal_ordering[i]].row,
                                         rp_table.html_mirror[current_view_html_ordering[change_happened]].row);
                ideals_moved.push(current_view_ideal_ordering[i]);
            }  
        }
    } // end for checking matches
}

/**
 * 
 * @param {RpTable} rptable 
 * @param {*} column_name 
 * @param {*} column_index 
 * @returns 
 */
function sort_rptable(rptable, column_name, column_index){
    let pass_filters = rptable.html_mirror.filter((x)=> x.passes_filters());
    let col_info = rptable.columnsInfo.filter((x)=> x.name == column_name);
    if (col_info == null || col_info.length !=1)
    {
        console.log(col_info);
        alert('Do not know which column to sort '+ column_name);
        return;
    }
    col_info = col_info[0];
    // it has to be the absolute, because we are looking into the data.
    let current_passing_indices = pass_filters.map(get_abs_index);
    if (col_info.nextSorting == 'none' || col_info.nextSorting == 'asc'){
        console.log('will ascend');
        current_passing_indices.sort((i,j)=> comparing_strings_from_indices(rptable.data, column_name, i,j));
        col_info.nextSorting = 'desc';
    }
    else
    {
        console.log('will descend');
        current_passing_indices.sort((i,j)=> comparing_strings_from_indices(rptable.data, column_name, j,i));
        col_info.nextSorting = 'asc'
    }
    // update the sorting indices
    for (let i =0; i < current_passing_indices.length; i ++){
        rptable.html_mirror[current_passing_indices[i]].sortingIndex =i;
    }
    
    // make the html rows visible if necessary
    let to_surface_n = Math.min(rptable.rowsPerPage, current_passing_indices.length);
    let to_surface = current_passing_indices.slice(0, to_surface_n);
    console.log('to surface')
    console.log(to_surface);
    let need_to_go = rptable.html_mirror.filter((x)=> x.display == true && to_surface.includes(x.absIndex)== false);
    console.log('need to go '+ need_to_go.length);
    console.log(need_to_go);
    for (let i =0; i < need_to_go.length; i ++)
    {
        need_to_go[i].make_invisible();
    }
    rptable.make_indices_visible(to_surface);
    sort_html_elements_in_view(rptable);
    return current_passing_indices;


}

/**
 * 
 * @param {RpTable} rptable 
 * @param {string} column_name 
 * @param {string} column_index 
 */
function sort_rptable_old(rptable, column_name, column_index)
{
    let column_info = rptable.columnsInfo[column_index];
    // the indices of the original data to consider
    let toConsider =Array.apply(null, Array(rptable.data.length)).map(function(x,i){return i;});
    //let toConsider = Array.apply((x)=>x, Array())
    toConsider = toConsider.filter((i) => rptable.html_mirror[i].passes_filters());
    console.log('to consider');
    console.log(toConsider);

    let before_ordering = Array.apply(null,
                                     toConsider.filter(x => x!= undefined))

    let comparing_strings= (x,y)=> rptable.compare_strings(rptable.data[x][column_name],
                                                           rptable.data[y][column_name]);
    //this.ordered_indeces.sort((x,y)=> this.comparator_strings(x,y, this));
    toConsider.sort((x,y)=> comparing_strings(x,y));
    console.log('this is the new order');
    console.log(toConsider);
    console.log('this is the previous ');
    console.log(before_ordering);

    let parent_node = my_table.html_mirror[0].row.parentNode;
    //every time there is a swap, the previous indixes get pushed one down.
    // e.g if 6 is the first element now, we have 
    // 6,0,1,2,3 ... the second entry will need to be compared swapped with 0, not 1
    let n_swaps =0;
    // only do the elements in the current page. toConsider only has
    // the ones that passed the filters.
    let limit = Math.min(toConsider.length, rptable.rowsPerPage);
    for (let i =0; i < limit; i ++){
        if (toConsider[i] != toConsider[i-n_swaps] | 4>3)
        {
            console.log('will swap  '+ toConsider[i] + ' with '+ before_ordering[i]);
            if (rptable.html_mirror[toConsider[i]].row == null){
                rptable.html_mirror[toConsider[i]].row = rptable.createDataRow(toConsider[i])
            }
            parent_node.insertBefore(rptable.html_mirror[toConsider[i]].row,
                                    rptable.html_mirror[before_ordering[i-n_swaps]].row)
            n_swaps++;

        }
    }
         
}




function create_sorters(rp_table)
{
    let sortable_columns = rp_table.columnNames.filter((x)=> x != undefined);
    for (let i =0; i < sortable_columns.length; i ++)
    {
        let icolumn_name = rp_table.columnNames[i].replace(' ','_');
        let _sorter_id = rp_table.name +"__mheader__"+icolumn_name;
        // this sorted id will need to refer to the newly created header_div
        let _header = document.getElementById(_sorter_id);
        if (_header != undefined){
            console.log('adding click listener to '+ _sorter_id);
            //_header.addEventListener('click', this.obtain_sorter(icolumn_name));
            _header.addEventListener('click',
                                     (e)=> sort_rptable(rp_table, icolumn_name, i));
        }
        else
        {
            console.log('could not find header with id '+ _sorter_id);
        }
    }
    rp_table.onViewChange = sort_html_elements_in_view;
}



function add_column_header_listeners()
{
    for(let i =0; i <rp_table.columnNames; i ++){

    }
}