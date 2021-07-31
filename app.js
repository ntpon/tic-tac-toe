const displayController = (() => {
  const formName = document.getElementById('form-name');
  let toggleAnimationPlayer = false;
  formName.addEventListener('submit', (event) => {
    event.preventDefault();
    const modalName = document.getElementById('modal-name');
    const namePlayerX = document.getElementById('player-1-name');
    const namePlayerY = document.getElementById('player-2-name');
    gameController.setNamePlayer(namePlayerX.value, namePlayerY.value);
    modalName.style.display = 'none';
  });

  const tiles = document.querySelectorAll('.tile');
  tiles.forEach((title) => {
    title.addEventListener('click', (event) => {
      const element = event.target.closest('div');
      const index = parseInt(element.id);
      if (!gameController.checkIsEmpty(index)) {
        return;
      }
      if (gameController.checkGameFinish()) {
        stopAnimation();
        return;
      }
      const span = document.createElement('span');
      span.textContent = gameController.getCurrentPlayerSign();
      element.append(span);
      gameController.updateGame(index);
      setAnimationPlayer();
    });
  });

  const btnPlayAgain = document.querySelector('.btn-play-again');
  btnPlayAgain.addEventListener('click', () => {
    window.location.reload();
  });

  const modalFinish = document.getElementById('modal-finish');
  modalFinish.style.display = 'none';
  const gameFinish = (text) => {
    const txtModal = document.getElementById('modal-text');
    txtModal.textContent = text;
    modalFinish.style.display = '';
  };

  const setName = (namePlayerX, namePlayerO) => {
    const txtNamePlayerX = document.getElementById('name-player-x');
    const txtNamePlayerO = document.getElementById('name-player-o');

    txtNamePlayerX.textContent = namePlayerX;
    txtNamePlayerO.textContent = namePlayerO;
    setAnimationPlayer();
  };

  const setAnimationPlayer = () => {
    const playerX = document.getElementById('container-player-1');
    const playerY = document.getElementById('container-player-2');
    toggleAnimationPlayer = !toggleAnimationPlayer;
    if (toggleAnimationPlayer) {
      playerX.classList.add('pulse');
      playerY.classList.remove('pulse');
    } else {
      playerX.classList.remove('pulse');
      playerY.classList.add('pulse');
    }
  };

  const stopAnimation = () => {
    const playerX = document.getElementById('container-player-1');
    const playerY = document.getElementById('container-player-2');
    playerX.classList.remove('pulse');
    playerY.classList.remove('pulse');
  };
  return { gameFinish, setName };
})();

const Player = (
  sign,
  name = 'Player',
  lists = [false, false, false, false, false, false, false, false, false]
) => {
  this.name = name;
  this.sign = sign;
  this.lists = lists;

  const getName = () => {
    return name;
  };

  const setName = (nameNew) => {
    name = nameNew;
  };

  const getSign = () => {
    return sign;
  };

  const getLists = () => {
    return lists;
  };

  const setLists = (index) => {
    lists[index] = true;
  };

  const isEmpty = (index) => {
    return !lists[index];
  };

  return { getSign, getLists, setLists, isEmpty, getName, setName };
};

const gameController = (() => {
  const playerX = Player('x');
  const playerO = Player('o');
  let round = 1;
  let isGameFinish = false;
  const checkGameFinish = () => {
    return isGameFinish;
  };
  const getCurrentPlayerSign = () => {
    return getCurrentPlayer().getSign();
  };
  const getCurrentPlayer = () => {
    // เลขคี่จะเป็นของ X
    // เลขคู่จะเป็นของ Y
    return round % 2 === 1 ? playerX : playerO;
  };
  const checkIsEmpty = (index) => {
    // เช็คว่าพื้นที่ว่างไหม
    const checkX = playerX.isEmpty(index);
    const checkY = playerO.isEmpty(index);
    return checkX && checkY;
  };

  const updateGame = (index) => {
    getCurrentPlayer().setLists(index);

    if (checkWin()) {
      gameFinish(`${getCurrentPlayer().getName()}  Win!`);
      isGameFinish = true;
      return;
    } else if (round >= 9) {
      isGameFinish = true;
      gameFinish(`Draw`);
      return;
    }
    round++;
  };

  const gameFinish = (text) => {
    setTimeout(() => {
      displayController.gameFinish(text);
    }, 1500);
  };

  const checkWin = () => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const lists = getCurrentPlayer().getLists();
    const newLists = [];
    lists.forEach((value, index) => {
      if (value) {
        newLists.push(index);
      }
    });

    for (condition of winConditions) {
      if (
        newLists.includes(condition[0]) &&
        newLists.includes(condition[1]) &&
        newLists.includes(condition[2])
      ) {
        return true;
      }
    }
    return false;
  };

  const setNamePlayer = (namePlayerX, namePlayerY) => {
    playerX.setName(namePlayerX);
    playerO.setName(namePlayerY);
    console.log(playerX.getName());
    console.log(playerO.getName());
    displayController.setName(playerX.getName(), playerO.getName());
  };

  return {
    getCurrentPlayer,
    updateGame,
    checkIsEmpty,
    getCurrentPlayerSign,
    checkGameFinish,
    setNamePlayer,
  };
})();
