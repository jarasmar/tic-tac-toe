import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
	return (
		<button 
			className={"square " + (props.winningSquare ? "winning-square" : null)} 
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}
  
class Board extends React.Component {
    renderSquare(i) {
      return (
		<Square 
			winningSquare={this.props.winningSquares.includes(i)}
			value={this.props.squares[i]} 
			onClick={() => this.props.onClick(i)}
		/>
	  );
    }
  
    render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
    }
}
  
class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				location: null
			}],
			stepNumber: 0,
			xIsNext: true,
			isDescending: true
		}
	}

	handleClick(i) {
		const locations = [
			[1, 1],
			[2, 1],
			[3, 1],
			[1, 2],
			[2, 2],
			[3, 2],
			[1, 3],
			[2, 3],
			[3, 3]
		];
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		// Ignore click if there is a winner or square filled
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				location: locations[i]
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		});
	}

	sortList() {
		this.setState({
			isDescending: !this.state.isDescending
		});
	}

    render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const desc = move ?
				'Go to move #' + move + ' at position ' + history[move].location :
				'Go to game start';
			const btnClass = (move === this.state.stepNumber) ?
				'selected' :
				'';
			return (
				
				<li key={move}>
					<button class={btnClass} onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			)
		});

		let status;
		if (winner) {
			status = 'Winner: ' + winner.player;
		} else if (!winner && this.state.history.length === 10) {
			status = 'It is a draw'
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div className="game">
			<div className="game-board">
				<Board 
					winningSquares={winner ? winner.line : []}
					squares={current.squares}
					onClick={(i) => this.handleClick(i)}
				/>
			</div>
			<div className="game-info">
				<div>{status}</div>
				<button onClick={() => this.sortList()}>
					Sort by: {this.state.isDescending ? "Descending" : "Ascending"}
				</button>
				<ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
			</div>
			</div>
		);
    }
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return { player: squares[a], line: [a, b, c]};
		}
	}
	return null;
}
  
// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  