<template>
  <md-dialog
    :md-active.sync="show"
    @md-closed="close()"
    @md-clicked-outside="close()">
    <md-dialog-title>Hjelp</md-dialog-title>
    <md-dialog-content class="legend-content">
      <div class="md-layout md-gutter">
        <div class="md-layout-item">
          <md-table>
            <md-table-toolbar>
              <h4>Hovedvisninger</h4>
            </md-table-toolbar>
            <md-table-row>
              <md-table-cell>Vanling</md-table-cell>
              <md-table-cell>Viser alle observasjoner som et punkt.</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Størrelse</md-table-cell>
              <md-table-cell>
                Viser alle observasjoner som et punkt med størrelse basert på antallet observert.
              </md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Varmekart</md-table-cell>
              <md-table-cell>
                Viser observasjoner som et varmekart, der rød betyr høyere tetthet av observert individer.
              </md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Grupper</md-table-cell>
              <md-table-cell>
                Observasjoner blir gruppert der tettheten er størst. Avhengig av zoom på kart.
              </md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>Tid</md-table-cell>
              <md-table-cell>
                Viser turene med enten grå eller rød farge i kronologisk rekkefølge basert på når de er gjennomført.
              </md-table-cell>
            </md-table-row>
          </md-table>
        </div>
        <div class="md-layout-item">
          <md-table>
            <md-table-toolbar>
              <h4>Tegnforklaringer</h4>
            </md-table-toolbar>
            <md-table-row>
              <md-table-head>Tegn</md-table-head>
              <md-table-head>Forklaring</md-table-head>
            </md-table-row>
            <md-table-row>
              <md-table-cell>
                <span class="dot trip-color">
                  <span class="dot-inline sheep-dot"/>
                </span>
              </md-table-cell>
              <md-table-cell>Saueobservasjon på oppsynstur</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>
                <span class="dot trip-color">
                  <span class="dot-inline predator-dot"/>
                </span>
              </md-table-cell>
              <md-table-cell>Rovdyrobservasjon på oppsynstur</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>
                <span class="dot trip-color">
                  <span class="dot-inline sheep-dot">
                    3
                  </span>
                </span>
              </md-table-cell>
              <md-table-cell>Saueobservasjon på oppsynstur med antall sau i punkt</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>
                <span
                  class="small-dot"
                  style="background-color: white;">
                  <span class="small-dot-inline api-predator-dot"/>
                </span>
              </md-table-cell>
              <md-table-cell>Kongeørn observert fra Rovdata</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>
                <span
                  class="small-dot"
                  style="background-color: black;">
                  <span class="small-dot-inline api-predator-dot"/>
                </span>
              </md-table-cell>
              <md-table-cell>Jerv observert fra Rovdata</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>
                <span
                  class="small-dot"
                  style="background-color: gray;">
                  <span class="small-dot-inline api-predator-dot"/>
                </span>
              </md-table-cell>
              <md-table-cell>Ulv observert fra Rovdata</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>
                <span
                  class="small-dot"
                  style="background-color: yellow;">
                  <span class="small-dot-inline api-predator-dot"/>
                </span>
              </md-table-cell>
              <md-table-cell>Gaupe observert fra Rovdata</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell>
                <span
                  class="small-dot"
                  style="background-color: brown;">
                  <span class="small-dot-inline api-predator-dot"/>
                </span>
              </md-table-cell>
              <md-table-cell>Bjørn observert fra Rovdata</md-table-cell>
            </md-table-row>
          </md-table>
        </div>
      </div>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button
        class="md-primary"
        @click="show = false">OK</md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
export default {
  name: 'Legend',
  data() {
    return {
      show: true,
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style>
/* .legend-content {
  padding: 2em;
} */

.dot {
  height: 26px;
  width: 26px;
  border-radius: 50%;
  display: inline-block;
}

.small-dot {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  display: inline-block;
}

.small-dot-inline {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-top: 1px;
  margin-left: 3px;
  text-align: center;
}

.dot-inline {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  display: inline-block;
  margin-top: 3px;
  margin-left: 3px;
  text-align: center;
}

.trip-color {
  background-color: chocolate;
}

.sheep-dot {
  background-color: white;
}

.predator-dot {
  background-color: gray;
}

.api-predator-dot {
  background-color: lightgray;
}
</style>
