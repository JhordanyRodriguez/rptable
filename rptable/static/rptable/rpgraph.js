
class Multiset extends Map {
  constructor(...args) {
      super(...args);
  }
  add(elem) {
      if (!this.has(elem))
          this.set(elem, 1);
      else
          this.set(elem, this.get(elem)+1);
  }
}



let RPgraph = class {

  /**
   * 
   * @param {HTMLElement} selectToPopulate 
   */
  populateSelect(selectToPopulate){
    for (let i =0; i < this.rptable.columns_info.length; i ++){
      let opt = document.createElement('option');
      opt.textContent = this.rptable.columns_info[i].name;
      opt.value = this.rptable.columns_info[i].index;
      selectToPopulate.options.add(opt);
    }
  }

  refreshNewSettings()
  {
    let hv = this.horizontalSelect.value;
    this.horizontalProperty= this.rptable.columns_info[hv].name;
    this.update_event();
  }
  /**
   * 
   * @param {RPTable} rptable 
   */
  constructor(rptable, parentDiv){
    //this.createNewChart();
    this.rptable = rptable;
    this.myChart = null;
    this.parentDiv = parentDiv;
    this.horizontalProperty ='carer';
    this.parentDiv.classList.add('row');
    this.left_column = document.createElement('div');
    this.left_column.classList.add('rpgraphColumn');
    this.left_column.classList.add('column');
    this.left_column.style.width= "48%";
    this.left_column.style.float= "left";
    this.parentDiv.appendChild(this.left_column);
    this.parentDiv.style.width = "100%";
    this.right_column = document.createElement('div');
    this.right_column.classList.add('rpgraphColumn');
    this.right_column.classList.add('column');
    this.right_column.style.width= "48%";
    this.right_column.style.float= "right";
    let horizontalLabel = document.createElement('label');
    horizontalLabel.textContent = "Property for X axis: "
    this.horizontalSelect = document.createElement('select');
    this.populateSelect(this.horizontalSelect);
    this.verticalSelect = document.createElement('select');
    this.populateSelect(this.verticalSelect);
    let verticalLabel = document.createElement('label');
    verticalLabel.textContent = 'Property for Y axis';
    this.right_column.appendChild(horizontalLabel);
    this.right_column.appendChild(this.horizontalSelect);
    this.right_column.appendChild(document.createElement('br'));
    this.right_column.appendChild(verticalLabel);
    this.right_column.appendChild(this.verticalSelect);

    let operationLabel = document.createElement('label');
    operationLabel.textContent = 'Operation in Y';
    let operationSelect = document.createElement('select');
    let operations =[{"value": 0, "textContent":"count"},
                      {"value": 1, "textContent":"sum"},
                      {"value": 2, "textContent":"mean"}]
    for (let i =0; i < operations.length; i ++){
      let op = document.createElement('option');
      op.textContent = operations[i]['textContent'];
      op.value = operations[i]['value'];
      operationSelect.options.add(op);
    }
    this.right_column.appendChild(document.createElement('br'));
    this.right_column.appendChild(operationLabel);
    this.right_column.appendChild(operationSelect);
    let setGraphButton = document.createElement('button');
    setGraphButton.textContent = 'refresh';
    setGraphButton.addEventListener('click', ()=> this.refreshNewSettings())
    this.right_column.appendChild(setGraphButton);
    
    this.parentDiv.appendChild(this.right_column);


    this.rptable.onContentChangedCallBacks.push(()=> this.update_event());
  }

  update_event(){
    let labelsData = this.get_basic_count(this.horizontalProperty);
    this.update_chart(labelsData);
  }

  update_chart(labelsAndData)
  {
    this.myChart.data.labels = labelsAndData["labels"];
    this.myChart.data.datasets[0].data = labelsAndData["data"];
    //console.log(labelsAndData["labels"]);
    //console.log(labelsAndData["data"]);
    this.myChart.update();
    
  }

  /**
   * 
   * @param {string} col 
   */
  get_basic_count(col){
    let passFilters = this.rptable.html_mirror.filter((x)=> x.passes_filters() == true);
    let absIndices = passFilters.map((x)=> x.abs_index);
    let counts = new Multiset();
    for (let i=0; i < absIndices.length; i ++){
      counts.add(this.rptable.data[absIndices[i]][col]);
    }
    let labels = [];
    let values =[];
    let iterator = counts.entries();
    iterator.forEach(element => {
      labels.push(element[0]);
      values.push(element[1]);
    });
    return {"labels": labels,
            "data": values
    };
    
  }

  createNewChart(col){
    
    //const ctx = document.getElementById('myChart');
    let basic_counts = this.get_basic_count(col);
    const ctx = document.createElement('canvas');
    ctx.id = 'myChart';
    this.left_column.appendChild(ctx);
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: basic_counts['labels'],
        datasets: [{
          label: col,
          data: basic_counts['data'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    let bottom = this.rptable.get_last_row_bottom();
    if (bottom != null){
      this.left_column.style.position = 'fixed';
      this.left_column.style.top = (bottom + 50) +'px';
      this.left_column.style.height = "50%";
      this.parentDiv.style.position = 'fixed';
      this.parentDiv.style.top = (bottom + 50) +'px';
      this.parentDiv.style.height = "50%";
    }
}

}
