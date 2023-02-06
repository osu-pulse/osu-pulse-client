<script lang="ts" setup></script>

<template>
  <div class="player-component">
    <div class="listening">
      <div class="song">
        <span class="name">Time Is Ticking Out</span>
        <span class="artist">TheCranberries</span>
      </div>
    </div>
    <div class="player">
      <div class="player-controls">
        <div class="sound">
          <BIconVolumeUp class="icon" />
          <div class="sound-line"></div>
        </div>

        <div class="controls">
          <BIconSkipStartFill class="icon" />
          <BIconPlayCircleFill class="icon play-icon" />
          <BIconSkipEndFill class="icon" />
        </div>

        <div class="settings">
          <BIconArrowRepeat class="icon" />
          <BIconShuffle class="icon" />
          <BIconThreeDotsVertical class="icon" />
        </div>
      </div>

      <div class="timeline">
        <div class="time">1:29</div>
        <div class="line"></div>
        <div class="time">2:30</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../src/shared/styles/mixins';
@use '../src/shared/styles/constants';

.player-component {
  display: flex;
  align-items: center;
  max-width: 1000px;
  max-height: 120px;
  border-radius: constants.$cmn-border-radius;
  background-color: constants.$clr-background;
  box-shadow: constants.$cmn-shadow-block;
  background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.3) 15%,
      rgb(255, 255, 255) 75%
    ),
    url('../assets/cover.jpg');
  background-position-y: 200px;

  .listening {
    .song {
      margin: 5px 0 0 0;
      display: flex;
      gap: 20px;
      font-size: 18px;
      letter-spacing: 1px;
      color: constants.$clr-primary;

      .name {
        font-weight: bold;
      }
    }
  }

  .player {
    margin: 0 10px;
    flex: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .player-controls {
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
      gap: 20px;

      .sound {
        display: flex;
        align-items: center;
        gap: 10px;

        .icon {
          color: constants.$clr-primary;
          font-size: 22px;
        }

        .sound-line {
          height: 3px;
          width: 70px;
          background-color: constants.$clr-primary;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .controls {
        display: flex;
        align-items: center;
        gap: 10px;
        color: constants.$clr-primary;

        .icon {
          font-size: 30px;

          &:hover {
            cursor: pointer;
          }
        }

        .play-icon {
          font-size: 40px;
        }
      }

      .settings {
        display: flex;
        align-items: center;
        gap: 10px;

        .icon {
          padding: 5px;
          background-color: constants.$clr-secondary;
          border-radius: constants.$cmn-sm-border-radius;
          font-size: 27px;

          &:hover {
            cursor: pointer;
          }
        }
      }
    }

    .timeline {
      display: flex;
      gap: 20px;
      justify-content: space-between;
      align-items: center;

      .time {
        color: constants.$clr-primary;
        font-size: 15px;
      }

      .line {
        flex: auto;
        height: 4px;
        background-color: constants.$clr-primary;
        border-radius: constants.$cmn-sm-border-radius;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  @media only screen and (max-width: 991px) {
    flex-direction: column;

    .player {
      //background-color: #6874dc;
    }
  }

  @media only screen and (min-width: 992px) {
    background-image: none;

    .listening {
      position: relative;
      width: 180px;
      height: 120px;
      border-radius: constants.$cmn-border-radius 0 0
        constants.$cmn-border-radius;

      &:before {
        content: '';
        display: block;
        background-image: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.2) 25%,
            rgb(255, 255, 255) 75%
          ),
          url('../assets/cover.jpg');
        background-position-y: 200px;
        border-radius: constants.$cmn-border-radius 0 0
          constants.$cmn-border-radius;
        width: 100%;
        height: 100%;
        opacity: 0.5;
      }

      .song {
        position: absolute;
        top: 30px;
        right: 10px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        color: constants.$clr-text;
        font-size: 18px;
        line-height: 25px;
        letter-spacing: 1px;

        .name {
          font-weight: bold;
        }
      }
    }

    .player {
      gap: 15px;
    }
  }

  @media only screen and (min-width: 1250px) {
    .listening {
      width: 250px;
    }

    .player {
      .player-controls {
        .controls {
          gap: 15px;
        }

        .settings {
          .icon {
            font-size: 32px;
          }
        }
      }

      .timeline {
        padding: 0 10px;

        .time {
          font-size: 16px;
        }
      }
    }
  }

  @media only screen and (min-width: 1450px) {
    .listening {
      width: 350px;
    }

    .player {
      .player-controls {
        .controls {
          gap: 20px;
        }

        .settings {
          .icon {
            font-size: 35px;
          }
        }
      }

      .timeline {
        padding: 0 20px;

        .time {
          font-size: 18px;
        }
      }
    }
  }
}
</style>
