class GreedySnake {
  constructor (id) {
    this.id = id;
    this.food_container = [];
    this.foodNow = {};

    this.container = {
      length_x: 20,
      length_y: 20,
      width: 20,
      height: 20
    };

    this.arr_data = [
      {x: 2, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 0}
    ];

    this.snake_init = {
      head_color: 'red',
      body_color: 'blue',
      food_color: 'green',
      init_length: 3,
      init_speed: 2,
      time: 0.2,
      direction:{x:1, y:0}
    };

    this.initContainer();

    var that = this;
    this.arr_data.unshift = function(val){
        that.renderNode(that.arr_data[0], that.snake_init.body_color);
        Array.prototype.unshift.call(this, val);
        console.log('unshift');
        that.renderNode(val, that.snake_init.head_color);
        //从食物列表移除该节点
        var index = that.food_container.indexOf(val.y * that.container.length_x + val.x );
        that.food_container.splice(index,1);
    };

    this.arr_data.pop = function(){
        var lastNode = that.arr_data.slice(-1)[0];
        that.renderNode(lastNode, 'white');
        //将该节点放入食物列表
        that.food_container.push( lastNode.y * that.container.length_x + lastNode.x);
        Array.prototype.pop.call(this);
        console.log('pop');
      };
  }
  //初始化棋盘
  initContainer () {
    var newFragment = '';
    for (var i = 0; i < this.container.length_x; i++) {
      for (var j = 0; j < this.container.length_y; j++) {
        newFragment += '<li></li>';            
        this.food_container.push(i * this.container.length_x + j);
      }
    }
    var that = this;
    $('#' + this.id).append('<ul>' + newFragment + '</ul>');
    $('#' + this.id).find('li').css({
      'height': that.container.height + 'px',
      'width': that.container.width + 'px',
    });
    $('#' + this.id).find('ul').css({
      'height': that.container.height * that.container.length_y + 'px',
      'width': that.container.width * that.container.length_x + 'px',
    });
    this.renderData();
    this.initFoodContainer();
    this.randomFood();
    setInterval(()=>{
      this.moveForward(this.snake_init.direction);
    }, this.snake_init.time * 1000);
  }

  moveNode ({x,y}) {
    console.log('move before', this.arr_data);
    this.arr_data.unshift({
      x: x,
      y: y
    });
    this.arr_data.pop();
    console.log('move after', this.arr_data);
  }

  addNode ({x,y}) {
    console.log('获取食物', {
          x,
          y
        });
    this.arr_data.unshift({
      x,
      y
    });

    this.randomFood();
  }
  initFoodContainer () {
    this.arr_data.forEach((val)=>{
      this.food_container.splice(val.y * this.container.length_x + val.x , 1);
    });
  }

  //随机食物
  randomFood () {
    var length = this.food_container.length;
    var index = Math.floor(Math.random() * length);
    console.log('生成随机食物', index);
    var food = {
      x: this.food_container[index] % (this.container.length_x ),
      y: Math.floor(this.food_container[index] / (this.container.length_x ) )
    };
    this.foodNow = food;
    this.renderNode(food, this.snake_init.food_color);
  }

  moveForward ({
    x = 0,
    y = 0
  }) {
    var temp_head = this.generate_template_head({
      x,
      y
    });
    if (!this.checkVaild(temp_head)) {
      return this.die_msg('不能超出边界！！');
    }
    if (this.is_self(temp_head)) {
      return this.die_msg('不能吃自己！！');
    }
    this.snake_init.direction = {x:x, y:y};
    if ( temp_head.x === this.foodNow.x && temp_head.y === this.foodNow.y ) {
      this.addNode(temp_head);
    } else {
      this.moveNode(temp_head);
    }
  }

  generate_template_head ({
    x = 0,
    y = 0
  }) {
    var head = this.arr_data[0];
    var temp_head = {
      x: head.x + x,
      y: head.y + y
    };
    return temp_head;
  }

  checkVaild ({
    x,
    y
  }) {
    var flag = true;
    if (x < 0 || y < 0 || x > this.container.length_x - 1 || y > this.container.length_y - 1) {
      flag = false;
    }
    return flag;
  }

  //判断是否回退
  is_self({
    x,
    y
  }) {
    var flag = false;
    this.arr_data.forEach((val)=>{
      if(val.x === x && val.y === y ){
        flag = true;
      }
    });
    return flag;
  }

  die_msg (msg = 'you are die') {
    alert(msg);
  }

  renderData () {
    this.arr_data.forEach((val, index) => {
      var color = index === 0 ?
        color = this.snake_init.head_color :
        this.snake_init.body_color;
      this.renderNode(val, color);
    });
  }

  renderNode ({
    x,
    y
  }, color) {
    var nth = y * this.container.length_x + x + 1;
    $('#' + this.id).find('li:nth-child(' + nth + ')').css('background-color', color);
  }
}

var Snake = new  GreedySnake('content');
$(document).on('keyup', function (e) {
  console.log(e.keyCode);
  switch (e.keyCode) {
    case 40:
      Snake.moveForward({
        x: 0,
        y: 1
      });
      console.log('down');
      break;
    case 38:
      Snake.moveForward({
        x: 0,
        y: -1
      });
      console.log('up');
      break;
    case 39:
      Snake.moveForward({
        x: 1,
        y: 0
      });
      console.log('right');
      break;
    case 37:
      Snake.moveForward({
        x: -1,
        y: 0
      });
      console.log('left');
      break;
    default:
      console.log('else');
  }
});