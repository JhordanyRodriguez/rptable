var aglobal ="";


let RPEditor = class{

    /**
     * 
     * @param {RPTable} rptable 
     * @param {CallableFunction} editCallBack will receive the abs index (row), the unique ids
     *                                        (based on the unique_ids property), the column name
     *                                       (edited property), the new value, the old value,
     *                                          and the whole object 
     */
    constructor(rptable, editCallBack){
        this.rptable = rptable;
        this.editCallBack  = editCallBack;
        rptable.tbody.addEventListener('click', (e)=>this.tdClicked(e));
        rptable.tbody.addEventListener('focusout', (event)=> this.inputEdited(event));
    }

    tdClicked(event){
        console.log('this');
        console.log(this);
        let target = event.target;
        aglobal = target;
        let previousContent = target.textContent;
        // if no input has been added.
        let row_id = target.parentElement.getAttribute('dindex'); 
        let col_id = target.getAttribute('column_idx');
        console.log('clicked row '+ row_id+ ' in column '+ col_id);
        if (target.childElementCount ==0)
        {
            let myInput = document.createElement('input');
            myInput.style.width= "95%";
            //myInput.textContent = previousContent;
            myInput.value = previousContent;
            target.textContent ='';
            target.appendChild(myInput);
        }
    }

    inputEdited(event){

        if (event.target != null && event.target.tagName.toLowerCase() == 'input'){
            let colID = event.target.parentElement.getAttribute('colID');
            let rowID = event.target.parentElement.parentElement.getAttribute('dindex');
            let column = this.rptable.columns_info[parseInt(colID)].name;
            console.log('editing row '+ rowID+ ' in column '+ colID);
            let oldContent = this.rptable.data[rowID][column];
            this.rptable.data[rowID][column]= event.target.value;
            let unIDs = [];
            for (let i=0; i < this.rptable.unique_ids.length; i ++){
                unIDs.push(this.rptable.data[rowID][this.rptable.unique_ids[i]]);
            }
   
            this.editCallBack(rowID, unIDs, column,this.rptable.data[rowID][column], oldContent, this.rptable.data[rowID]);
            // dispatch call
        }
    }
}