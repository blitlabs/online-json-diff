<template>
  <div>
    <table style="width:100%">
      <tr>
        <td>
          <codemirror ref="leftBox" :value="documentA" :options="cmOptions"></codemirror>
        </td>
        <td>
          <codemirror ref="rightBox" :value="documentB" :options="cmOptions"></codemirror>
        </td>
      </tr>
    </table>
    <button @click="markChanges">Show Changes</button>
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
    compare,
    parse
  },
  data() {
    return {
      documentA:
        '{ "firstName": "Albert", "lastName": "Einstein", "speed": "50", "groups": [ { "name": "test", "id": 4, "test1": "0", "test2": "0" }] }',
      documentB:
        '{ "firstName": "Albert", "lastName": "Collins", "age": "18", "groups": [ { "name": "thomas", "id": 4, "test2": "0", "test1": "1" }] }',
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