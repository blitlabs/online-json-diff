<template>
  <div>
    <table style="width:100%">
      <tr>
        <td @mouseover="enableScrollLeftBox" @mouseleave="disableScrollLeftBox">
          <codemirror ref="leftBox" :value="documentA" :options="cmOptions"></codemirror>
        </td>
        <td @mouseover="enableScrollRightBox" @mouseleave="disableScrollRightBox">
          <codemirror ref="rightBox" :value="documentB" :options="cmOptions"></codemirror>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";

import { compare } from "fast-json-patch";
import { parse } from "json-source-map";

export default {
  name: "JsonDiff",
  components: {
    codemirror,
  },
  data() {
    return {
      documentA:
        '{ "firstName": "Albert", "lastName": "Einstein", "speed": "50", "groups": [ { "name": "silvia", "id": 4, "gender": "f", "city": "berlin" }, { "name": "franz", "id": 3, "gender": "m", "city": "Seattle" }, { "name": "norbert", "id": 2, "gender": "m", "city": "new york" }] }',
      documentB:
        '{ "firstName": "Albert", "lastName": "Collins", "age": "18", "groups": [ { "name": "thomas", "id": 4, "gender": "m", "city": "london" }, { "name": "franz", "id": 3, "gender": "m", "city": "Seattle" }, { "name": "norbert", "id": 2, "gender": "m", "city": "new york" }, { "name": "renate", "id": 8, "gender": "f", "city": "sydney" } ] }',
      leftBoxScrollingActive:false,
      rightBoxScrollingActive:false,
      cmOptions: {
        mode: {
          name: "javascript",
          json: true
        },
        lineNumbers: true
      }
    };
  },
  mounted() {
    this.prepareDocuments();
    this.$nextTick(() => {
      this.markChanges();
    });
  },
  methods: {
    enableScrollLeftBox() {
      if (this.leftBoxScrollingActive) {
        return;
      }

      this.leftBoxScrollingActive = true;
      this.$refs.leftBox.codemirror.on('scroll', this.syncScrollLeftBox);
    },
    disableScrollLeftBox() {
      if (!this.leftBoxScrollingActive) {
        return;
      }

      this.leftBoxScrollingActive = false;
      this.$refs.leftBox.codemirror.off('scroll', this.syncScrollLeftBox);
    },
    syncScrollLeftBox()
    {
        var scrollInfo = this.$refs.leftBox.codemirror.getScrollInfo();
        this.$refs.rightBox.codemirror.scrollTo(scrollInfo.left, scrollInfo.top);
    },
    enableScrollRightBox() {
      if (this.rightBoxScrollingActive) {
        return;
      }

      this.rightBoxScrollingActive = true;
      this.$refs.rightBox.codemirror.on('scroll', this.syncScrollRightBox);
    },
    disableScrollRightBox() {
      if (!this.rightBoxScrollingActive) {
        return;
      }

      this.rightBoxScrollingActive = false;
      this.$refs.rightBox.codemirror.off('scroll', this.syncScrollRightBox);
    },
    syncScrollRightBox()
    {
        var scrollInfo = this.$refs.rightBox.codemirror.getScrollInfo();
        this.$refs.leftBox.codemirror.scrollTo(scrollInfo.left, scrollInfo.top);
    },
    prepareDocuments() {
      let spaceCount = 4;
      this.documentA = JSON.stringify(
        JSON.parse(this.documentA),
        null,
        spaceCount
      );
      this.documentB = JSON.stringify(
        JSON.parse(this.documentB),
        null,
        spaceCount
      );
    },
    //Find an other library for json-source-map or rewrite this logic
    getStartAndEndPosOfDiff(textValue, diff) {
      let result = parse(textValue);

      let pointers = result.pointers;
      let path = diff.path;
      let pointer = pointers[path];

      let start = {
        line: pointer.key ? pointer.key.line : pointer.value.line,
        ch: pointer.key ? pointer.key.column : pointer.value.column
      };
      let end = {
        line: pointer.valueEnd.line,
        ch: pointer.valueEnd.column
      };

      return {
        start: start,
        end: end
      };
    },
    markChanges() {
      let addColor = "#58fa58";
      let removeColor = "#dd4444";
      let replaceColor = "#e5e833";

      var diffs = compare(
        JSON.parse(this.documentA),
        JSON.parse(this.documentB)
      );

      let doc1 = this.$refs.leftBox.codemirror.getDoc();
      let doc2 = this.$refs.rightBox.codemirror.getDoc();

      diffs.forEach(diff => {
        let position1 = null;
        let position2 = null;

        switch (diff.op) {
          case "remove":
            position1 = this.getStartAndEndPosOfDiff(this.documentA, diff);
            doc1.markText(position1.start, position1.end, {
              readOnly: true,
              css: `background-color:${removeColor}`
            });
            break;
          case "add":
            position2 = this.getStartAndEndPosOfDiff(this.documentB, diff);
            doc2.markText(position2.start, position2.end, {
              css: `background-color:${addColor}`
            });
            break;
          case "replace":
            position1 = this.getStartAndEndPosOfDiff(this.documentA, diff);
            position2 = this.getStartAndEndPosOfDiff(this.documentB, diff);

            doc1.markText(position1.start, position1.end, {
              css: `background-color:${replaceColor}`
            });

            doc2.markText(position2.start, position2.end, {
              css: `background-color:${replaceColor}`
            });
            break;

          default:
            break;
        }
      });
    }
  }
};
</script>