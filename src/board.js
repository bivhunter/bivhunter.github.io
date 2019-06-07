
class Board {
    constructor( options ) {
        this._gameField = options.gameField;
        this.moveMult = 0;
        this.direction = 0;
        this._init();
    }

    _init() {
        let board = document.createElement( "div" );
        board.classList.add( "board" );
        this._elem = board;
    }

    //ініціалізація основних розмірів проходить ззовні, після рендерінгу дошки
    //щоб в CSS можна було задати різні розміри
    init() {
        this._width = this._elem.clientWidth;
        this._height = this._elem.clientHeight;
        this._borderWidth = ( this._elem.offsetWidth - this._width ) / 2;

        this._topPosition = this._gameField.clientHeight - this._elem.offsetHeight / 2 - 2;
        this.position = this._gameField.clientWidth / 2;
        this.renderPosition = this.position;

        this._setPosition( this.position );
        this._boardPointInit();
    }

    //Стартова позиція шара на дошці
    vecForBallStart(ball) {
        let x = this.renderPosition;
        let y = (this._topPosition - this._height / 2 - this._borderWidth - ball.radius);
        return new Vector(x, y);
    }
    
    //Для знаходження точок границі використовується рівняння еліпса
    //a, b - мала і велика осі
    //x_0, y_0 - центр еліпса
    //крок дискретизації 1px
    _boardPointInit() {
        let pointArr = [];
        let b = this._height / 2 + 3;
        let a = this._width / 2 + 3;
        let y_0 = this._topPosition;
        let x_0 = this.position;
        let bottom = this._gameField.clientHeight;

        //точки лівої границі
        for ( let i = bottom; i > y_0; i-- ) {
            pointArr.push( new Vector( x_0 - a, i ) );
        }

        //точки верхньої границі
        for ( let i = -a; i <= a; i++ ) {
            let y = y_0 - ( b / a ) * Math.sqrt( a * a - i * i );
            pointArr.push( new Vector( x_0 + i, y ) );
        }

        //точки правої границі
        for ( let i = y_0 + 1; i < bottom; i++ ) {
            pointArr.push( new Vector( x_0 + a, i ) );
        }

        this._pointerArr = pointArr;
        this._x_0 = x_0;
    }

    getPointArr() {
        let delta = this.position - this._x_0;
        let resArr = [];
        this._pointerArr.forEach( point => {
            resArr.push( new Vector( point.x + delta, point.y ) );
        } );
        return resArr;
    }

    render() {
        this._setPosition( this.renderPosition );
    }

    getElem() {
        return this._elem;
    }

    right() {
        return this.position + this._width / 2 + this._borderWidth;
    }

    bottom() {
        return this._topPosition + this._height / 2 + this._borderWidth;
    }

    top() {
        return this._topPosition - this._height / 2 - this._borderWidth;
    }

    left() {
        return this.position - this._width / 2 - this._borderWidth;
    }

    _setPosition( num ) {
        this._elem.style.left = num - this._width / 2 - this._borderWidth + "px";
        this._elem.style.top = this._topPosition - this._height / 2 - this._borderWidth + "px";
    }

    //Тестові методи для промальовки точок границі дошки
    //Додавання до gameField
    _testPoint() {
        this._pointerArr.forEach( point => {
            let elem = document.createElement( "div" );
            elem.classList.add( "point" );
            elem.style.left = point.x + "px";
            elem.style.top = point.y + 1 + "px";
            document.getElementById( "game-field" ).appendChild( elem );
        } );
    }

    //змещення точок при зміщенні дошки
    renderPoint() {
        let pointArr = this.getPointArr();
        //console.log(pointArr);
        let field = document.getElementById( "game-field" );
        let pointList = field.querySelectorAll( ".point" );
        for ( let i = 0; i < pointList.length; i++ ) {
            pointList[ i ].style.left = pointArr[ i ].x + "px";
        }
    }
}