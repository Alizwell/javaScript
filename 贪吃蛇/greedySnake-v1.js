    var Snake = (function (id) {
      this.id = id;
      this.head = [0, 0];
      this.status = [];
      this.food_container = [];
      this.foodNow = {};
      //容器属性
      this.container = {
        length_x: 20,
        length_y: 20,
        height: 20,
        width: 20
      };
      this.firstNode = {
        x: 2,
        y: 0
      };
      this.arr_data = [this.firstNode, {
        x: 1,
        y: 0
      }, {
        x: 0,
        y: 0
      }];

      arr_data.unshift = function (val) {
        renderNode(arr_data[0], snake_init.body_color);
        Array.prototype.unshift.call(this, val);
        console.log('unshift');
        renderNode(val, snake_init.head_color);
        //从食物列表移除该节点
        var index = food_container.indexOf(val.y * container.length_x + val.x );
        food_container.splice(index,1);
      };

      arr_data.pop = function () {
        var lastNode = arr_data.slice(-1)[0];
        renderNode(lastNode, 'white');
        //将该节点放入食物列表
        food_container.push( lastNode.y * container.length_x + lastNode.x);
        Array.prototype.pop.call(this);
        console.log('pop');
      };
      //蛇的初始属性
      this.snake_init = {
        head_color: 'red',
        body_color: 'blue',
        food_color: 'green',
        init_length: 3,
        init_speed: 2,
        time: 0.2,
        direction:{x:1, y:0}
      };

      initContainer();

      //初始化棋盘
      function initContainer() {
        var newFragment = '';
        for (var i = 0; i < this.container.length_x; i++) {
          for (var j = 0; j < this.container.length_y; j++) {
            newFragment += '<li></li>';            
            this.food_container.push(i * container.length_x + j);
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
        renderData();
        initFoodContainer();
        randomFood();
        setInterval(()=>{
          moveForward(snake_init.direction);
        }, snake_init.time * 1000);
      }

      function moveNode({
        x,
        y
      }) {
        console.log('move before', arr_data);
        arr_data.unshift({
          x: x,
          y: y
        });
        arr_data.pop();
        console.log('move after', arr_data);
      }

      //当获取到一个食物时 
      function addNode({
        x,
        y
      }) {
        console.log('获取食物', {
          x,
          y
        });

        this.arr_data.unshift({
          x,
          y
        });

        randomFood();
      }

      function initFoodContainer(){
        arr_data.forEach((val)=>{
          food_container.splice(val.y * container.length_x + val.x , 1);
        });
      }

      //随机食物
      function randomFood() {
        var length = food_container.length;
        var index = Math.floor(Math.random() * length);
        console.log('生成随机食物', index);
        var food = {
          x: food_container[index] % (container.length_x ),
          y: Math.floor(food_container[index] / (container.length_x ) )
        };
        this.foodNow = food;
        renderNode(food, snake_init.food_color);
      }

      function moveForward({
        x = 0,
        y = 0
      }) {
        var temp_head = generate_template_head({
          x,
          y
        });
        if (!checkVaild(temp_head)) {
          return die_msg('不能超出边界！！');
        }
        if (is_self(temp_head)) {
          return die_msg('不能吃自己！！');
        }
        snake_init.direction = {x:x, y:y};
        if ( temp_head.x === foodNow.x && temp_head.y === foodNow.y ) {
          addNode(temp_head);
        } else {
          moveNode(temp_head);
        }
      }

      function generate_template_head({
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


      function checkVaild({
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
      function is_self({
        x,
        y
      }) {
        var flag = false;
        arr_data.forEach((val)=>{
          if(val.x === x && val.y === y ){
            flag = true;
          }
        });
        return flag;
      }

      function die_msg(msg = 'you are die') {
        alert(msg);
      }

      function renderData() {
        this.arr_data.forEach((val, index) => {
          var color = index === 0 ?
            color = snake_init.head_color :
            snake_init.body_color;
          renderNode(val, color);
        });
      }

      function renderNode({
        x,
        y
      }, color) {
        var nth = y * container.length_x + x + 1;
        $('#' + id).find('li:nth-child(' + nth + ')').css('background-color', color);
      }
      return {
        moveForward: moveForward,
        renderData: renderData
      }
    })('content');

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