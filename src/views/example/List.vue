<template>
  <ul class="list">
    <li v-for="({ name, value, unit }, ind) in list" :key="ind" class="item">
      <span class="value-wrapper">
        <span class="name">{{ name }}</span>
        <span class="value">{{ value }}</span>
        <span class="unit">{{ unit }}</span>
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
type ListItem = {
  name: string
  value: number
  unit: string
}
const mockData = new Array(7).fill({
  name: 'aaa',
  value: 8989898989898989,
  unit: '元元元'
})
const mw = parseInt((1 / mockData.length) * 100 + '') + '%'
const list = ref<ListItem[]>(mockData)
</script>

<style lang="scss" scoped>
.list {
  position: relative;
  display: flex;

  .item {
    position: relative;
    // width: 100%;
    width: v-bind(mw);
    padding: 4px;
    text-align: center;
    // display: flex;
    // justify-content: center;
    &::after {
      position: absolute;
      display: inline-block;
      width: 1px;
      height: 50px;
      line-height: 50px;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      background-color: gray;
      content: '';
    }

    .value-wrapper {
      display: inline-block;
      max-width: 100%;
      border: 1px solid #000;
      text-align: left;
      .name {
        display: inline-block;
        height: 40px;
        width: 100%;
      }
      .value {
        display: inline-block;
        width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        font-size: 30px;
        margin-right: 10px;
      }
      .unit {
        display: inline-block;
        vertical-align: top;
      }
    }
  }
}
</style>
