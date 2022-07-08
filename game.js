let world = kaboom({
  global: true,
  fullscreen: true,
  clearColor: [0.2196, 0.502, 0.8039, 1],
  debug: true,
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("block", "block.png");
loadSprite("easter_egg", "block.png");
loadSprite("explode", "explode.png");
loadSprite("mario", "mario.png");
loadSprite("sun1", "sun1.png");
loadSprite("sun2", "sun2.png");
loadSprite("sun3", "sun3.png");
loadSprite("sun4", "sun4.png");
loadSprite("bom", "boom.png");
loadSprite("box", "surprise.png");
loadSprite("cloud", "cloud.png");
loadSprite("coin", "coin.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("serprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("gumgum", "evil_mushroom.png");
loadSprite("spike", "spike.png");
loadSprite("updown", "updown.png");
loadSprite("sponge", "sponge.png");
loadSprite("castle", "castle.png");

loadSound("gameSound", "gameSound.mp3");
loadSound("jumpSound", "jumpSound.mp3");
loadSound("louse", "louse.mp3");
loadSound("easter_egg", "easter_egg.mp3");
loadSound("coin", "coin.mp3");
loadSound("Exploded", "Exploded.mp3");
loadSound("win", "win.mp3");
//////////////////////////////////////////

scene("over", () => {
  add([
    text("you lose!\n pres -R- reastart\n made by Kamil.N ", 32),
    origin("center"),
    pos(width() * 0.5, height() * 0.5),
  ]);
  keyDown("r", () => {
    go("game");
  });
  volume(1);
  play("louse");
});

scene("begin", () => {
  add([
    text("welcom to mario\npress -enter to start"),
    origin("center"),
    pos(width() / 2, height() / 2 - 100),
  ]);

  const btn = add([
    rect(80, 60),
    origin("center"),
    pos(width() / 2, height() / 2),
    color(0.1, 0.1, 0.1),
  ]);
  add([
    text("start!", 14),
    origin("center"),
    pos(width() / 2, height() / 2),
    color(0.1, 0.1, 0.1),
  ]);

  btn.action(() => {
    if (btn.isHovered()) {
      btn.color = (0.5, 0.5, 0.5);
      if (mouseIsClicked()) {
        go("game");
      }
    } else {
      btn.color = rgb(1, 1, 1);
    }
  });
});

scene("win", (score) => {
  add([
    text("you win\nScore:" + score, 20),
    origin("center"),
    pos(width() / 2, height() / 2 - 100),
  ]);
  play("win");
  keyPress("enter", () => {
    go("game");
  });
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");

  let background = play("gameSound");

  const key = {
    width: 20,
    height: 20,
    $: [sprite("coin"), "coin"],
    C: [sprite("castle"), "castle"],
    "=": [sprite("block"), solid()],
    7: [sprite("easter_egg"), solid(), "easter_egg"],
    "*": [sprite("cloud")],
    "?": [sprite("box"), solid(), "serprise_coin"],
    ".": [sprite("updown"), solid(), "updown"],
    "!": [sprite("box"), solid(), "serprise_mushroom"],
    M: [sprite("mushroom"), body(), "mushroom"],
    x: [sprite("unboxed"), solid(), "unboxed"],
    0: [sprite("bom"), solid(), "boom"],
    "^": [sprite("gumgum"), solid(), body(), "gumgum"],
    "@": [sprite("gumgum"), solid(), body(), "gumgum"],
    d: [sprite("explode"), "explode"],
    i: [sprite("spike"), solid(), body(), "spike"],
  };
  const map = [
    "      *       *                 *              *                        *                           *                                                       ",
    " *       *           *               *            *                          *                                  *                                           ",
    "              *              *                     *      **                            *      *                      *                                     ",
    "                                                                                                                                                            ",
    "                                                                                                                                                            ",
    "                                                                                                                                                            ",
    "                                                                                                                                                            ",
    "                          =!=====                                           = =====                                                                         ",
    "                ==?=                                                                                                                                        ",
    "                        0                          ^    ======                                                                                              ",
    "                       =======      =        ===!m==                                                                                               C        ",
    "     ==$=     7=!==                 @                             ======                                                                                    ",
    "                                   ==                                                                                                                       ",
    "            @       0            ====                                                                                                                       ",
    "=========.=======================================================.=      ====.==============================================================================",
    "===================================================================      ===================================================================================",
    "===================================================================iiiiii==================================================================================",
  ];

  let isJumping = false;
  let score = 0;
  const speed = 120;
  const jumpforce = 360;
  const level = addLevel(map, key);
  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(jumpforce),
  ]);

  const scoreable = add([
    text("score\n" + score),
    origin("center"),
    pos(30, 230),
    layer("ui"),
    {
      value: score,
    },
  ]);
  keyDown("d", () => {
    player.move(speed, 0);
  });

  keyDown("a", () => {
    if (player.pos.x > 10) {
      player.move(-speed, 0);
    }
  });
  keyPress("space", () => {
    if (player.grounded()) {
      player.jump(jumpforce);
      play("jumpSound");
    }
  });
  player.on("headbump", (obj) => {
    if (obj.is("serprise_coin")) {
      level.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      level.spawn("x", obj.gridPos);
    }

    if (obj.is("serprise_mushroom")) {
      level.spawn("M", obj.gridPos.sub(0, 1));
      destroy(obj);
      level.spawn("x", obj.gridPos);
    }

    if (obj.is("easter_egg")) {
      add([
        text("you unlocked an\n easter_egg", 32),
        origin("center"),
        pos(width() * 0.5, height() * 0.5),
      ]);
      play("easter_egg");
      player.use(sprite("sponge"));
    }
  });

  //if(player.pos.x > 60){
  ///console.log(world.clearColor);
  ///world.clearColor = [0,0,0,1]

  player.collides("coin", (x) => {
    destroy(x);
    play("coin");
    scoreable.value += 100;
    scoreable.text = "SCORE\n" + scoreable.value;
  });
  player.collides("spike", (x) => {
    destroy(player);
    background.pause();
    go("over");
  });
  player.collides("mushroom", (x) => {
    destroy(x);
    player.biggify(120);
    scoreable.value += 1000;
    scoreable.text = "SCORE\n" + scoreable.value;
  });

  player.collides("gumgum", (x) => {
    if (isJumping) {
      destroy(x);
    } else {
      destroy(player);
      background.pause();
      go("over");
    }
  });

  action("mushroom", (x) => {
    x.move(-20, 0);
  });
  action("gumgum", (x) => {
    x.move(-20, 0);
  });

  player.collides("boom", (x) => {
    const explode = level.spawn("d", x.gridPos);
    destroy(player);
    background.stop();
    play("Exploded");
    destroy(x);
    wait(3, () => {
      destroy(explode);
      go("over");
    });
  });

  player.action(() => {
    camPos(player.pos);
    scoreable.pos.x = player.pos.x - 50;
    if (player.pos.x >= 2980.65068) {
      go("win", scoreable.value);
      background.pause();
    }
    if (player.grounded()) {
      isJumping = false;
    } else {
      isJumping = true;
    }
    if (player.pos.y >= height() + 250) {
      background.stop();
      go("over");
    }
  });

  let blockSpeed = 15;

  action("updown", (x) => {
    x.move(0, blockSpeed);
  });
  loop(5, () => {
    blockSpeed = blockSpeed * -1;
  });
});
start("begin");
