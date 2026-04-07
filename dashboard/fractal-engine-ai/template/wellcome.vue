<template lang="html">
  <div id="wrapper">
    <div>
      <div
        id="sections">
        <div
          class="option"
          v-on:click="onChangeCheckbox('results')"
          v-bind:class="{
            'active': ((sectionActive === 'results')?true:false),
          }">
          {{ $t('results') }}
        </div>
        <div
          class="option"
          v-on:click="onChangeCheckbox('blocks')"
          v-bind:class="{
            'active': ((sectionActive === 'blocks')?true:false),
          }">
          {{ $t('blocks') }}
        </div>
        <div
          class="option"
          v-on:click="onChangeCheckbox('candidates')"
          v-bind:class="{
            'active': ((sectionActive === 'candidates')?true:false),
          }">
          {{ $t('candidates') }}
        </div>
      </div>
      <div class="bar-tool">
        <Checkbox
          v-if="sectionActive === 'blocks'"
          label="mostrar bloques en mapa"
          v-bind:onChangeValue="onChangeCheckbox"
          propName="blocks-map"
          v-bind:currentValue="showBlocksInMap"/>
        <Checkbox
          v-if="sectionActive === 'blocks'"
          label="activar todos los municipios"
          v-bind:onChangeValue="onChangeCheckbox"
          propName="select-all"
          v-bind:currentValue="selectAll"/>
        <Checkbox
          v-if="sectionActive === 'blocks'"
          label="sumar votos de coa"
          v-bind:onChangeValue="onChangeCheckbox"
          propName="take-coa-votes"
          v-bind:currentValue="takeCoaVotes"/>
      </div>
    </div>
    <div>
      <div id="politic-parties">
        <div
          v-if="sectionActive === 'blocks'"
          id="politic-parties-items">
          <template
            v-for="(party, keyParty) of parties">
            <div
              class="button"
              v-bind:class="{
                active: party.active,
              }"
              v-on:click="onClickPoliticParty(party)">
              <img
                v-bind:src="`/static/dashboard/fractal-engine-ai/assets/icons/${ party.icon }`"/>
            </div>
          </template>
        </div>
      </div>
    </div>
    <perfect-scrollbar>
      <div id="map-wrapper">
        <p id="town-name">
          {{ currentTownName }}
        </p>
        <svg
          id="map"
          version="1.0"
          xmlns="http://www.w3.org/2000/svg">
          <g>
            <template v-for="(i, index) of svgItems">
              <a
                v-on:click="onTownClick(index)"
                v-on:mouseover="onTownOver(index)"
                v-on:mouseleave="onTownLeave()"
                v-bind:style="{
                  fill: ((sectionActive === 'candidates')?i.winner.local_district_color:((!showBlocksInMap && sectionActive === 'results')?i.winner.color:i.winner.block)),
                }"
                v-html="i.path"
                :class="[
                  'town',
                  i.winner.party,
                  i.winner.coa,
                  ((!showBlocksInMap && sectionActive === 'blocks')?i.active:''),
                ]">
              </a>
            </template>
          </g>
        </svg>
      </div>
    </perfect-scrollbar>
    <div
      v-if="sectionActive === 'blocks' && competitivityBlockCollection.getModels().length">
      <ListTable
        v-bind:collection="competitivityBlockCollection"
        v-bind:identifier="'id'"
        v-bind:isLoading="isLoading"
        v-bind:isOverBody="true"
        v-bind:model="competitivityBlockModel"
        v-bind:modelDefaultProps="competitivityBlockDefaultProps"
        v-bind:modelKey="{ letter: 'name' }"
        v-bind:onlyWrapper="true"
        propColor="block"/>
    </div>
    <div
      v-if="sectionActive === 'results' && townSelected !== null">
      <div id="coa-parties">
        <div class="item-definition">
          <div class="text">
            <span>COALICIÓN A</span>
          </div>
        </div>
        <div id="politic-parties">
          <div
            id="politic-parties-items">
            <template
              v-for="(party, keyParty) of plotPartiesA">
              <div
                class="button"
                v-bind:class="{
                  active: party.active,
                }"
                v-on:click="onClickPoliticPlotParty(party)">
                <img
                  v-bind:src="`/static/dashboard/fractal-engine-ai/assets/icons/${ party.icon }`"/>
              </div>
            </template>
          </div>
        </div>
        <div class="item-definition">
          <div class="text">
            <span>COALICIÓN B</span>
          </div>
        </div>
        <div id="politic-parties">
          <div
            id="politic-parties-items">
            <template
              v-for="(party, keyParty) of plotPartiesB">
              <div
                class="button"
                v-bind:class="{
                  active: party.active,
                }"
                v-on:click="onClickPoliticPlotParty(party)">
                <img
                  v-bind:src="`/static/dashboard/fractal-engine-ai/assets/icons/${ party.icon }`"/>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <NavigationTab
      name="results"
      v-if="sectionActive === 'results' && townSelected !== null && this.chartData.labels.length"
      v-bind:tabIcons="resultTabIcons">
      <template #comparación>
        <div class="item-definition center">
          <div class="text">
            <span>gráfica para: </span>{{ `${ ((townSelected !== null)?townSelected.winner.name:'') }` }}
          </div>
        </div>
        <div ref="gd">
        </div>
        <div class="item-definition center">
          <div class="text">
            <span>b = </span>{{ plotExpression.b }}
          </div>
          <div class="text">
            <span>m = </span>{{ plotExpression.m }}
          </div>
          <div class="text">
            <span>f(x) = </span>{{ plotExpression.expression }}
          </div>
          <div class="text">
            <span>factor de correlación = </span>{{ plotExpression.fc }}
          </div>
          <p class="accent">
            {{ plotExpression.percent }}
          </p>
          <div id="color-wrapper">
            <div
              v-bind:class="{
                'color-a': ((plotExpression.fcColor === 1)?true:false),
                'color-b': ((plotExpression.fcColor === 2)?true:false),
                'color-c': ((plotExpression.fcColor === 3)?true:false),
              }">
            </div>
          </div>
        </div>
      </template>
      <template #votos>
        <BarChart
          :key="chartAKey"
          v-bind:chartData="chartData"
          v-bind:chartOptions="chartOptions"/>
      </template>
      <template #ganados>
        <div ref="plotTownWinner">
        </div>
        <ListTable
          v-if="partyTownWinnerCollection.getModels().length"
          v-bind:collection="partyTownWinnerCollection"
          v-bind:identifier="'id'"
          v-bind:isLoading="isLoading"
          v-bind:isOverBody="true"
          v-bind:model="partyTownWinnerModel"
          v-bind:modelDefaultProps="partyTownWinnerDefaultProps"
          v-bind:modelKey="{ letter: 'municipio' }"
          v-bind:onlyWrapper="true"/>
      </template>
      <template #resultados>
        <ListTable
          v-bind:collection="resultCollection"
          v-bind:identifier="'id'"
          v-bind:isLoading="isLoading"
          v-bind:isOverBody="true"
          v-bind:model="resultModel"
          v-bind:modelDefaultProps="resultDefaultProps"
          v-bind:modelKey="{ letter: 'name' }"
          v-bind:onlyWrapper="true"/>
      </template>
    </NavigationTab>
    <NavigationTab
      name="candidates"
      v-if="sectionActive === 'candidates'"
      v-bind:tabIcons="candidateTabIcons">
      <template #presidentes>
        <template
          v-if="candidateTabIcons[0].show">
          <ListTable
            v-bind:collection="candidatePresidenteCollection"
            v-bind:identifier="'id'"
            v-bind:isLoading="isLoading"
            v-bind:isOverBody="true"
            v-bind:model="candidateModel"
            v-bind:modelDefaultProps="candidateDefaultProps"
            v-bind:modelKey="{ letter: 'nombre' }"
            v-bind:onlyWrapper="true"/>
        </template>
      </template>
      <template #diputados>
        <template
          v-if="candidateTabIcons[1].show">
          <ListTable
            v-bind:collection="candidateDiputadoCollection"
            v-bind:identifier="'id'"
            v-bind:isLoading="isLoading"
            v-bind:isOverBody="true"
            v-bind:model="candidateModel"
            v-bind:modelDefaultProps="candidateDefaultProps"
            v-bind:modelKey="{ letter: 'nombre' }"
            v-bind:onlyWrapper="true"/>
        </template>
      </template>
      <template #síndicos>
        <template
          v-if="candidateTabIcons[2].show">
          <ListTable
            v-bind:collection="candidateSindicoCollection"
            v-bind:identifier="'id'"
            v-bind:isLoading="isLoading"
            v-bind:isOverBody="true"
            v-bind:model="candidateModel"
            v-bind:modelDefaultProps="candidateDefaultProps"
            v-bind:modelKey="{ letter: 'nombre' }"
            v-bind:onlyWrapper="true"/>
        </template>
      </template>
      <template #regidores>
        <template
          v-if="candidateTabIcons[3].show">
          <ListTable
            v-bind:collection="candidateRegidorCollection"
            v-bind:identifier="'id'"
            v-bind:isLoading="isLoading"
            v-bind:isOverBody="true"
            v-bind:model="candidateModel"
            v-bind:modelDefaultProps="candidateDefaultProps"
            v-bind:modelKey="{ letter: 'nombre' }"
            v-bind:onlyWrapper="true"/>
        </template>
      </template>
      <template `#${ candidateTabIcons[4].slot_name }`>
        <template
          v-if="candidateTabIcons[4].show">
          <ListTable
            v-bind:collection="candidateRegidorGroupCollection"
            v-bind:identifier="'id'"
            v-bind:isLoading="isLoading"
            v-bind:isOverBody="true"
            v-bind:model="candidateModel"
            v-bind:modelDefaultProps="candidateDefaultProps"
            v-bind:modelKey="{ letter: 'nombre' }"
            v-bind:onlyWrapper="true"/>
        </template>
      </template>
      <template #base>
        <template
          v-if="candidateTabIcons[5].show">
          <ListTable
            v-bind:collection="candidateBaseCollection"
            v-bind:identifier="'id'"
            v-bind:isLoading="isLoading"
            v-bind:isOverBody="true"
            v-bind:model="candidateModel"
            v-bind:modelDefaultProps="candidateDefaultProps"
            v-bind:modelKey="{ letter: 'nombre' }"
            v-bind:onlyWrapper="true"/>
        </template>
      </template>
      <template `#${ candidateTabIcons[6].slot_name }`>
        <template
          v-if="candidateTabIcons[6].show">
          <div id="blocks">
            <div>
              <h2>
                {{ $t('bloque alto') }}
              </h2>
              <div
                class="block">
                <h3>
                  {{ $t('hombre') }}
                </h3>
                <template v-for="(i, k) of blockAData.h">
                  <div
                    class="item-definition">
                    <div
                      class="icon"
                      v-bind:style="{
                        'background-color': '#28b154',
                      }">
                    </div>
                    <div
                      class="text">
                      <span>{{ k }}:</span> {{ i }}
                    </div>
                  </div>
                </template>
              </div>
              <div
                class="block">
                <h3>
                  {{ $t('mujer') }}
                </h3>
                <template v-for="(i, k) of blockAData.m">
                  <div
                    class="item-definition">
                    <div
                      class="icon"
                      v-bind:style="{
                        'background-color': '#28b154',
                      }">
                    </div>
                    <div
                      class="text">
                      <span>{{ k }}:</span> {{ i }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div>
              <h2>
                {{ $t('bloque medio') }}
              </h2>
              <div
                class="block">
                <h3>
                  {{ $t('hombre') }}
                </h3>
                <template v-for="(i, k) of blockBData.h">
                  <div
                    class="item-definition">
                    <div
                      class="icon"
                      v-bind:style="{
                        'background-color': '#ffd203',
                      }">
                    </div>
                    <div
                      class="text">
                      <span>{{ k }}:</span> {{ i }}
                    </div>
                  </div>
                </template>
              </div>
              <div
                class="block">
                <h3>
                  {{ $t('mujer') }}
                </h3>
                <template v-for="(i, k) of blockBData.m">
                  <div
                    class="item-definition">
                    <div
                      class="icon"
                      v-bind:style="{
                        'background-color': '#ffd203',
                      }">
                    </div>
                    <div
                      class="text">
                      <span>{{ k }}:</span> {{ i }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div>
              <h2>
                {{ $t('bloque bajo') }}
              </h2>
              <div
                class="block">
                <h3>
                  {{ $t('hombre') }}
                </h3>
                <template v-for="(i, k) of blockCData.h">
                  <div
                    class="item-definition">
                    <div
                      class="icon"
                      v-bind:style="{
                        'background-color': '#e8132e',
                      }">
                    </div>
                    <div
                      class="text">
                      <span>{{ k }}:</span> {{ i }}
                    </div>
                  </div>
                </template>
              </div>
              <div
                class="block">
                <h3>
                  {{ $t('mujer') }}
                </h3>
                <template v-for="(i, k) of blockCData.m">
                  <div
                    class="item-definition">
                    <div
                      class="icon"
                      v-bind:style="{
                        'background-color': '#e8132e',
                      }">
                    </div>
                    <div
                      class="text">
                      <span>{{ k }}:</span> {{ i }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </template>
    </NavigationTab>
    <div
      id="float-left">
      <Widget
        sectionTitle="datos primarios"
        sectionDescription="índice de colores"
        v-bind:isLoading="isLoading"
        width="100%"
        maxWidth="300px">
        <div
          id="district-colors">
          <template
            v-if="sectionActive === 'candidates'"
            v-for="(i, k) of Object.keys(localDistrictColor)">
            <template
              v-if="localDistrictColor[i].active">
              <div class="item-definition">
                <div
                  class="icon"
                  v-bind:style="{
                    'background-color': localDistrictColor[i].color,
                  }">
                </div>
                <div class="text">
                  {{ (parseInt(i) + 1) }}
                </div>
              </div>
            </template>
          </template>
        </div>
        <template
          v-if="sectionActive === 'blocks'"
          v-for="(i, k) of Object.keys(blockColors)">
          <div class="item-definition">
            <div
              class="icon"
              v-bind:style="{
                'background-color': blockColors[i],
              }">
            </div>
            <div class="text">
              {{ i }}
            </div>
          </div>
        </template>
        <template
          v-if="sectionActive === 'results'"
          v-for="(i, k) of Object.keys(colors)">
          <div class="item-definition">
            <div
              class="icon"
              v-bind:style="{
                'background-color': colors[i],
              }">
            </div>
            <div class="text">
              {{ i.replaceAll('_', ', ') }}
            </div>
          </div>
        </template>
      </Widget>
    </div>
    <div
      id="float-right">
      <Widget
        v-if="sectionActive === 'candidates' && townSelected !== null"
        v-bind:sectionTitle="townSelected.winner.name"
        sectionDescription="datos generales"
        v-bind:isLoading="isLoading"
        width="100%"
        maxWidth="300px">
        <template
          v-for="(i, k) of candidateRegidorDefaultProps">
          <template>
            <div
              class="item-definition">
              <div
                class="icon"
                v-bind:style="{
                  'background-color': '#00629f',
                }">
              </div>
              <div
                class="text">
                <span>{{ i.replaceAll('_', ' ') }}:</span> {{ candidateTown.get(i) }}
              </div>
            </div>
          </template>
        </template>
        <div
          class="item-definition">
          <div
            class="icon"
            v-bind:style="{
              'background-color': '#00629f',
            }">
          </div>
          <div
            class="text">
            <span>id municipio:</span> {{ townSelected.winner.data.get('town_id') }}
          </div>
        </div>
        <div
          class="item-definition">
          <div
            class="icon"
            v-bind:style="{
              'background-color': '#00629f',
            }">
          </div>
          <div
            class="text">
            <span>distrito local:</span> {{ townSelected.winner.data.get('local_district').toString() }}
          </div>
        </div>
        <Button
          buttonIcon="table_view"
          v-bind:data="'presidente'"
          v-bind:buttonAction="showCandidateCard">
          {{ $t('presidentes') }}
        </Button>
        <Button
          buttonIcon="table_view"
          v-bind:data="'diputado'"
          v-bind:buttonAction="showCandidateCard">
          {{ $t('diputados') }}
        </Button>
        <Button
          buttonIcon="table_view"
          v-bind:data="'sindico'"
          v-bind:buttonAction="showCandidateCard">
          {{ $t('sindicos') }}
        </Button>
        <Button
          buttonIcon="table_view"
          v-bind:data="'regidor'"
          v-bind:buttonAction="showCandidateCard">
          {{ $t('regidores') }}
        </Button>
      </Widget>
      <Widget
        v-if="sectionActive === 'results' && townSelected !== null"
        v-bind:sectionTitle="townSelected.winner.name"
        sectionDescription="aritmética electoral"
        v-bind:isLoading="isLoading"
        width="100%"
        maxWidth="300px">
        <div
          v-if="townSelected.winner.coa === 'coa'"
          class="item-definition">
          <div
            class="icon"
            v-bind:style="{
              'background-color': '#00629f',
            }">
          </div>
          <div class="text">
            <span>coalición:</span> {{ townSelected.winner.party.replaceAll('_', ', ') }}
          </div>
        </div>
        <div
          v-if="townSelected.winner.coa === 'coa'"
          class="item-definition">
          <div
            class="icon"
            v-bind:style="{
              'background-color': '#00629f',
            }">
          </div>
          <div class="text">
            <span>coa total:</span> {{ townSelected.winner.coa_total }}
          </div>
        </div>
        <div
          v-if="townSelected.winner.coa === ''"
          class="item-definition">
          <div
            class="icon"
            v-bind:style="{
              'background-color': '#00629f',
            }">
          </div>
          <div class="text">
            <span>partido:</span> {{ townSelected.winner.party }}
          </div>
        </div>
        <div
          v-if="townSelected.winner.coa === ''"
          class="item-definition">
          <div
            class="icon"
            v-bind:style="{
              'background-color': '#00629f',
            }">
          </div>
          <div class="text">
            <span>total:</span> {{ townSelected.winner.single_total }}
          </div>
        </div>
        <hr />
        <template
          v-for="(attrKey, i) of resultDefaultProps">
          <div
            class="item-definition">
            <div
              class="icon"
              v-bind:style="{
                'background-color': '#00629f',
              }">
            </div>
            <div class="text">
              <span>{{ attrKey.replaceAll('_', ' ') }}:</span> {{ townSelected.winner.data.get(attrKey) }}
            </div>
          </div>
        </template>
        <Button
          buttonIcon="feed"
          v-bind:buttonAction="showCard">
          ficha política
        </Button>
      </Widget>
    </div>
  </div>
</template>

<script>
import {
  GeoJSON2SVG
} from 'geojson2svg'
import Plotly from 'plotly.js-dist-min'

import {
  parse,
  range,
  compile,
} from 'mathjs'

//import map from "../resource/lib/map"

import Button from '../component/button.vue'
import Checkbox from '../component/checkbox.vue'
import Grid from '../component/grid.vue'
import InputText from '../component/input-text.vue'
import ListTable from '../component/list-table.vue'
import LoadingBar from '../component/loading-bar.vue'
import NavigationTab from '../component/navigation-tab.vue'
import Widget from '../component/widget.vue'
import BarChart from '../component/chart/bar-chart.vue'


export default {
  components: {
    BarChart,
    Button,
    Checkbox,
    Grid,
    InputText,
    ListTable,
    LoadingBar,
    NavigationTab,
    Widget,
  },
  data () {
    return {
      isLoading: false,
      sectionActive: 'results', // NOTE: 'results', 'blocks'
      showBlocksInMap: false,
      selectAll: false,
      takeCoaVotes: false,
      resultTabIcons: [
        {
          slot_name: 'comparación',
          slot_icon: 'multiline_chart',
        },
        {
          slot_name: 'votos',
          slot_icon: 'how_to_vote',
        },
        {
          slot_name: 'ganados',
          slot_icon: 'military_tech',
        },
        {
          slot_name: 'resultados',
          slot_icon: 'database',
        },
      ],
      resultCollection: new this.$model.ResultMC.collection(),
      resultModel: new this.$model.ResultMC.model(),
      competitivityBlockCollection: new this.$model.CompetitivityBlockMC.collection(),
      competitivityBlockModel: new this.$model.CompetitivityBlockMC.model(),
      resultDefaultProps: [
        'id',
        'name',
        'total_votos',
        'votos_nulos',
        'votos_validos',
        'lista_nominal',
        'participacion_ciudadana',
        'pan',
        'pri',
        'prd',
        'pt',
        'pvem',
        'mc',
        'morena',
      ],
      competitivityBlockDefaultProps: [],
      parties: [
        {
          name: 'movimiento ciudadano',
          abr: 'mc',
          icon: 'mc.png',
          active: false,
        },
        {
          name: 'morena',
          abr: 'morena',
          icon: 'morena.png',
          active: false,
        },
        {
          name: 'partido acción nacional',
          abr: 'pan',
          icon: 'pan.png',
          active: false,
        },
        {
          name: 'partido revolucionario democratico',
          abr: 'prd',
          icon: 'prd.png',
          active: false,
        },
        {
          name: 'partido revolucionario institucional',
          abr: 'pri',
          icon: 'pri.png',
          active: false,
        },
        {
          name: 'partido del trabajo',
          abr: 'pt',
          icon: 'pt.png',
          active: false,
        },
        {
          name: 'partido verde',
          abr: 'pvem',
          icon: 'pv.png',
          active: false,
        },
      ],
      colors: {
        pan: '#00579c',
        pri: '#28b154',
        prd: '#ffd203',
        pt: '#e8132e',
        pvem: '#9fce67',
        mc: '#ff7e00',
        morena: '#a53422',
        pan_pri_prd: '#4f8d62',
        pan_pri: '#148478',
        pan_prd: '#809450',
        pri_prd : '#94c22c',
        pt_morena: '#c62428',
        'activo': '#00629f',
      },
      blockColors: {
        alto: '#28b154',
        medio: '#ffd203',
        bajo: '#e8132e',
        indefinido: '#666666',
        'activo': '#00629f',
        'no activo': '#888888',
      },
      // NOTE: start map
      svgStr: '',
      geojsonData: geojsonData,
      svgItems: [],
      // NOTE: end map
      townSelected: null,
      defaultCoa: [
        'pan_pri_prd',
        'pan_pri',
        'pan_prd',
        'pri_prd',
        'pt_morena',
      ],
      activeTowns: {},
      currentTownName: '',
      cardModalData: null,
      chartAKey: '',
      chartData: {
        labels: [],
        datasets: [],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      plotExpression: {},
      plotPartiesA: [],
      plotPartiesB: [],
      partyTownWinnerCollection: new this.$model.ModelMC.collection(),
      partyTownWinnerModel: new this.$model.ModelMC.model(),
      partyTownWinnerDefaultProps: [],
      // NOTE: START CANDIDATE
      candidateTabIcons: [
        {
          slot_name: 'presidentes',
          slot_icon: 'face',
          show: true,
        },
        {
          slot_name: 'diputados',
          slot_icon: 'group',
          show: false,
        },
        {
          slot_name: 'síndicos',
          slot_icon: 'group',
          show: false,
        },
        {
          slot_name: 'regidores',
          slot_icon: 'group',
          show: false,
        },
        {
          slot_name: 'regidores prioridad',
          slot_icon: 'group',
          show: false,
        },
        {
          slot_name: 'base',
          slot_icon: 'database',
          show: false,
        },
        {
          slot_name: 'acciones afirmativas',
          slot_icon: 'category',
          show: false,
        },
      ],
      localDistrictColor: [
        { color: '#F44336', active: false },
        { color: '#E91E63', active: false },
        { color: '#9C27B0', active: false },
        { color: '#673AB7', active: false },
        { color: '#3F51B5', active: false },
        { color: '#2196F3', active: false },
        { color: '#03A9F4', active: false },
        { color: '#00BCD4', active: false },
        { color: '#009688', active: false },
        { color: '#4CAF50', active: false },
        { color: '#4CAF50', active: false },
        { color: '#CDDC39', active: false },
        { color: '#FFEB3B', active: false },
        { color: '#FFC107', active: false },
        { color: '#FF9800', active: false },
        { color: '#4CAF50', active: false },
        { color: '#4CAF50', active: false },
        { color: '#607D8B', active: false },
        { color: '#E65100', active: false },
        { color: '#FFC107', active: false },
        { color: '#006064', active: false },
        { color: '#8C9EFF', active: false },
        { color: '#FF80AB', active: false },
        { color: '#424242', active: false },
      ],
      candidateModel: new this.$model.CandidateMC.model(),
      regidorModel: new this.$model.RegidorMC.model(),
      baseModel: new this.$model.CandidateBaseMC.model(),
      candidateBaseCollection: new this.$model.CandidateMC.collection(),
      candidateRegidorCollection: new this.$model.CandidateMC.collection(),
      candidatePresidenteCollection: new this.$model.CandidateMC.collection(),
      candidateDiputadoCollection: new this.$model.CandidateMC.collection(),
      candidateSindicoCollection: new this.$model.CandidateMC.collection(),
      candidateRegidorGroupCollection: new this.$model.RegidorMC.collection(),
      candidateTownName: '',
      candidateTown: null,
      candidateModalData: null,
      candidateRegidorDefaultProps: [
        'id',
        'municipio',
        'bloque',
        'regidores',
        'h1',
        'm1',
        'h2',
        'm2',
        'h3',
        'm3',
        'h4',
        'm4',
        'h5',
        'm5',
      ],
      candidateDefaultProps: [
        'id',
        'no_lista',
        'distrito_local',
        'bloque',
        'municipio',
        'nombre',
        'felefono',
        'posible_cargo',
        'genero',
        'acc_afirmativa',
        'referente',
      ],
      candidateBaseDefaultProps: [
        'id',
        'no_lista',
        'distrito_local',
        'bloque',
        'municipio',
        'nombre',
        'felefono',
        'posible_cargo',
        'genero',
        'acc_afirmativa',
        'regidor_actual',
        'referente',
      ],
      blockACollection: new this.$model.CandidateMC.collection(),
      blockBCollection: new this.$model.CandidateMC.collection(),
      blockCCollection: new this.$model.CandidateMC.collection(),
      // NOTE: END CANDIDATE
      accionesAfirmativas: {
        'JOVEN': 'joven',
        'LGBT+': 'lgtb',
        'MIGRANTE': 'migrante',
        'DISCAPACITADO': 'discapacitado',
        'INDIGENA': 'indigena',
      },
      blockAData: {
        collection: null,
        h: {
          total: 0,
          lgtb: 0,
          indigena: 0,
          discapacidad: 0,
          migrante: 0,
          joven: 0,
        },
        m: {
          total: 0,
          lgtb: 0,
          indigena: 0,
          discapacidad: 0,
          migrante: 0,
          joven: 0,
        },
      },
      blockBData: {
        collection: null,
        h: {
          total: 0,
          lgtb: 0,
          indigena: 0,
          discapacidad: 0,
          migrante: 0,
          joven: 0,
        },
        m: {
          total: 0,
          lgtb: 0,
          indigena: 0,
          discapacidad: 0,
          migrante: 0,
          joven: 0,
        },
      },
      blockCData: {
        collection: null,
        h: {
          total: 0,
          lgtb: 0,
          indigena: 0,
          discapacidad: 0,
          migrante: 0,
          joven: 0,
        },
        m: {
          total: 0,
          lgtb: 0,
          indigena: 0,
          discapacidad: 0,
          migrante: 0,
          joven: 0,
        },
      },
    }
  },
  computed: {

  },
  created () {
    this.generateSVGMap()
    this.setup()
    this.$emitter.on('app-toggle-full-content', () => {
      this.chartAKey = this.$uuid.v1()
    })
    this.$emitter.on('navigation-tab-click', (data) => {
      if (data.name === 'results') {
        this.chartAKey = this.$uuid.v1()
        setTimeout(this.renderPlot, 10)
      } else if (data.name === 'candidates') {
        for (let i in this.candidateTabIcons) {
          let t = this.candidateTabIcons[i]
          this.candidateTabIcons[i].show = false
          if (t.slot_name === data.slot)
            this.candidateTabIcons[i].show = true
        }
      }
    })
    let partiesData = JSON.stringify(this.parties)
    this.plotPartiesA = JSON.parse(partiesData)
    this.plotPartiesB = JSON.parse(partiesData)
  },
  beforeDestroy () {

  },
  methods: {
    createModelEventListener () {

    },
    removeModelEventListener () {

    },
    async setup () {
      try {
        this.isLoading = true
        this.resultCollection.set('state', 'michoacán')
        this.candidateBaseCollection.set('type', 'base')
        await this.resultCollection.fetch()
        await this.candidateBaseCollection.fetch()
        this.setMapData()
        this.filterCollections()
        this.generateCandidateBlocks()
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },
    filterCollections () {
      this.candidatePresidenteCollection = this.candidateBaseCollection.filter(m => {
        return (m.get('posible_cargo') === 'PRESIDENCIA MUNICIPAL')
      })
      this.candidateDiputadoCollection = this.candidateBaseCollection.filter(m => {
        return (m.get('posible_cargo') === 'DIPUTADO LOCAL')
      })
      this.candidateSindicoCollection = this.candidateBaseCollection.filter(m => {
        return (m.get('posible_cargo') === 'SINDICO')
      })
      this.candidateRegidorCollection = this.candidateBaseCollection.filter(m => {
        return (m.get('posible_cargo') === 'REGIDOR')
      })
      let regidoresGroup = []
      for (let i in this.svgItems) {
        let town = this.svgItems[i].winner
        if (town.id === undefined)
          continue

        let townName = town.name.toLowerCase()
        let totalRegidores = 0
        let municipio = ''
        let bloque = ''
        let noListaTotal = {
          h1: 0,
          m1: 0,
          h2: 0,
          m2: 0,
          h3: 0,
          m3: 0,
          h4: 0,
          m4: 0,
          h5: 0,
          m5: 0,
        }
        for (let regidorModel of this.candidateRegidorCollection.getModels()) {
          municipio = this.removeAccents(regidorModel.get('municipio').toLowerCase())
          if (municipio !== townName)
            continue

          bloque = regidorModel.get('bloque')
          totalRegidores = totalRegidores + 1
          let noLista = regidorModel.get('no_lista')
          if (regidorModel.get('genero') === 'H')
            noListaTotal[`h${ noLista }`] = noListaTotal[`h${ noLista }`] + 1
          else if (regidorModel.get('genero') === 'M')
            noListaTotal[`m${ noLista }`] = noListaTotal[`m${ noLista }`] + 1
        }
        regidoresGroup.push({
          id: town.id,
          municipio: townName,
          bloque: bloque,
          regidores: totalRegidores,
          h1: noListaTotal.h1,
          m1: noListaTotal.m1,
          h2: noListaTotal.h2,
          m2: noListaTotal.m2,
          h3: noListaTotal.h3,
          m3: noListaTotal.m3,
          h4: noListaTotal.h4,
          m4: noListaTotal.m4,
          h5: noListaTotal.h5,
          m5: noListaTotal.m5,
        })
      }
      this.candidateRegidorGroupCollection.add(regidoresGroup)
    },
    onResizeWindow () {
//      this.generateSVGMap()
    },
    setMapData () {
      for (let i in this.svgItems) {
        let iName = this.removeAccents(this.geojsonData.features[i].properties.name).toLowerCase()
        let models = this.resultCollection.filter(m => {
          let mName = this.removeAccents(m.get('name')).toLowerCase()
          return (mName === iName)
        })
        if (!models.getModels().length)
          continue

        let rModel = models.getModels()[0]
        let id = rModel.get('town_id')
        let rName = rModel.get('name')
        let localDistrict = rModel.get('local_district')
        for (let ld of localDistrict)
          this.localDistrictColor[ld - 1].active = true
        let localDistrictColor = this.localDistrictColor[localDistrict[0] - 1].color
        this.svgItems[i].winner = {
          id: id,
          name: rName,
          coa_total: 0,
          single_total: 0,
          data: rModel,
          coa: '',
          party: '',
          block: '#888888',
          local_district_color: localDistrictColor,
        }
        // NOTE: GET THE MAYOR FOR COA AND SINGLE PARTIES
        let coaTotalVotes = 0
        let coaKey = ''
        let singleTotalVotes = 0
        let singleKey = ''
        for (let p of this.parties) {
          for (let k of Object.keys(rModel.attributes)) {
            // NOTE: COA
            if (k.includes('_') && k.includes(p.abr) && parseInt(rModel.get(k)) > coaTotalVotes) {
              coaTotalVotes = parseInt(rModel.get(k))
              coaKey = k
            }
            // NOTE: SINGLE
            if (k === p.abr && parseInt(rModel.get(k)) > singleTotalVotes) {
              singleTotalVotes = parseInt(rModel.get(k))
              singleKey = k
            }
          }
        }
        // NOTE: CHECK IF IS PARTY AND SET DATA
        this.svgItems[i].winner.party = singleKey
        this.svgItems[i].winner.color = this.colors[singleKey]
        if (coaKey.includes(singleKey) && coaTotalVotes > singleTotalVotes) {
          this.svgItems[i].winner.coa = 'coa'
          this.svgItems[i].winner.party = coaKey.toString()
          this.svgItems[i].winner.color = this.colors[coaKey]
        }
        this.svgItems[i].winner.coa_total = coaTotalVotes
        this.svgItems[i].winner.single_total = singleTotalVotes
      }
    },
    generateCandidateBlocks () {
      let blockAData = {
        collection: null,
        h: {
          total: 0,
          lgtb: 0,
          indigena: 0,
          discapacidad: 0,
          migrante: 0,
          joven: 0,
        },
        m: {
          total: 0,
          lgtb: 0,
          indigena: 0,
          discapacidad: 0,
          migrante: 0,
          joven: 0,
        },
      }
      let blockBData = {
        collection: null,
        h: {
          total: 0,
          lgtb: 0,
          indigena: 0,
          discapacidad: 0,
          migrante: 0,
          joven: 0,
        },
        m: {
          total: 0,
          lgtb: 0,
          indigena: 0,
          discapacidad: 0,
          migrante: 0,
          joven: 0,
        },
      }
      let blockCData = {
        collection: null,
        h: {
          total: 0,
          lgtb: 0,
          indigena: 0,
          discapacidad: 0,
          migrante: 0,
          joven: 0,
        },
        m: {
          total: 0,
          lgtb: 0,
          indigena: 0,
          discapacidad: 0,
          migrante: 0,
          joven: 0,
        },
      }
      this.candidateBaseCollection.filter(m => {
        let afKeys = Object.keys(this.accionesAfirmativas)
        if (m.get('bloque') === 'ALTA') {
          let accAfirmativaArr = m.get('acc_afirmativa').split(' ')
          if (m.get('genero') === 'H') {
            blockAData.h.total = parseInt(blockAData.h.total) + 1
            for (let af of accAfirmativaArr) {
              let index = afKeys.indexOf(af)
              if (index >= 0)
                blockAData.h[this.accionesAfirmativas[afKeys[index]]] = blockAData.h[this.accionesAfirmativas[afKeys[index]]] + 1
            }
          } else if (m.get('genero') === 'M') {
            blockAData.m.total = parseInt(blockAData.m.total) + 1
            for (let af of accAfirmativaArr) {
              let index = afKeys.indexOf(af)
              if (index >= 0)
                blockAData.m[this.accionesAfirmativas[afKeys[index]]] = blockAData.m[this.accionesAfirmativas[afKeys[index]]] + 1
            }
          }
        } else if (m.get('bloque') === 'MEDIA') {
          let accAfirmativaArr = m.get('acc_afirmativa').split(' ')
          if (m.get('genero') === 'H') {
            blockBData.h.total = parseInt(blockBData.h.total) + 1
            for (let af of accAfirmativaArr) {
              let index = afKeys.indexOf(af)
              if (index >= 0)
                blockBData.h[this.accionesAfirmativas[afKeys[index]]] = blockBData.h[this.accionesAfirmativas[afKeys[index]]] + 1
            }
          } else if (m.get('genero') === 'M') {
            blockBData.m.total = parseInt(blockBData.m.total) + 1
            for (let af of accAfirmativaArr) {
              let index = afKeys.indexOf(af)
              if (index >= 0)
                blockBData.m[this.accionesAfirmativas[afKeys[index]]] = blockBData.m[this.accionesAfirmativas[afKeys[index]]] + 1
            }
          }
        } else if (m.get('bloque') === 'BAJA') {
          let accAfirmativaArr = m.get('acc_afirmativa').split(' ')
          if (m.get('genero') === 'H') {
            blockCData.h.total = parseInt(blockCData.h.total) + 1
            for (let af of accAfirmativaArr) {
              let index = afKeys.indexOf(af)
              if (index >= 0)
                blockCData.h[this.accionesAfirmativas[afKeys[index]]] = blockCData.h[this.accionesAfirmativas[afKeys[index]]] + 1
            }
          } else if (m.get('genero') === 'M') {
            blockCData.m.total = parseInt(blockCData.m.total) + 1
            for (let af of accAfirmativaArr) {
              let index = afKeys.indexOf(af)
              if (index >= 0)
                blockCData.m[this.accionesAfirmativas[afKeys[index]]] = blockCData.m[this.accionesAfirmativas[afKeys[index]]] + 1
            }
          }
        }
        return false
      })
      // NOTE: BLOCK ALTA
      this.blockAData = blockAData
      this.blockBData = blockBData
      this.blockCData = blockCData
    },
    generateCompetitivityBlocks () {
      // NOTE: RESET VALUES
      this.competitivityBlockDefaultProps = [
        'id',
        'name',
        'block',
        'total_votos',
      ]
      this.competitivityBlockCollection.clear()
      this.competitivityBlockCollection = new this.$model.CompetitivityBlockMC.collection()
      // NOTE: 1 - FOR EACH SELECTED TOWN AND PARTIES CALC PORCENT
      let selectedParties = this.getSelectedParties(this.parties)
      if (this.activeTowns.length === 0 || selectedParties.length === 0)
        return

      let coaPropName = selectedParties.toString().replaceAll(',', '_')
      // NOTE: 2 - FOR EACH SELECTED TOWN CALC PORCENT ACCORDING TO SELECTED PARTIES
      for (let atKey of Object.keys(this.activeTowns)) {
        let m = this.activeTowns[atKey].winner.data
        if (m === undefined)
          continue

        let townId = m.get('town_id')
        let townName = m.get('name')
        let totalVotes = parseInt(m.get('total_votos'))
        let coaTotal = 0
        let competitivityBlock = new this.$model.CompetitivityBlockMC.model()
        let coa = null
        let totalCoaVotes = 0
        competitivityBlock.set({
          id: townId,
          name: townName,
          total_votos: totalVotes,
        })
        for (let sp of selectedParties) {
          let totalPartyVotes = parseInt(m.get(sp))
          totalCoaVotes = totalCoaVotes + totalPartyVotes
          let percentPartyVotes = (parseInt(m.get(sp)) * 100 / totalVotes).toFixed(4)
          this.addCustomProp(competitivityBlock, `${ sp }_total`, totalPartyVotes)
          this.addCustomProp(competitivityBlock, `${ sp }_%`, percentPartyVotes)
        }
        // NOTE: 3 - GET COA VOTES ONLY IF THERE IS MORE THAN 1 PARTY SELECTED
        if (selectedParties.length > 1) {
          coa = this.coaExists(m, selectedParties)
          if (coa.exists) {
            // NOTE: UNCOMMENT FOR SUM COA IF EXISTS
            coaTotal = parseInt(m.get(coa.prop_name))
            if (this.takeCoaVotes)
              totalCoaVotes = totalCoaVotes + coaTotal
            this.addCustomProp(competitivityBlock, `${ coaPropName }_coa_total`, coaTotal)
          }
          let percentVotes = ((totalCoaVotes * 100 / totalVotes) / selectedParties.length).toFixed(4)
          this.addCustomProp(competitivityBlock, `${ coaPropName }_total`, totalCoaVotes)
          this.addCustomProp(competitivityBlock, `${ coaPropName }_%`, percentVotes)
        }
        this.competitivityBlockCollection.add(competitivityBlock)
      }
      // NOTE: 4 - CLEAN UP MAP
      for (let svgItem of this.svgItems)
        if (svgItem.winner.id)
          svgItem.winner.block = '#888888'
      // NOTE: 5 - SET 3 BLOCKS ACCORDING TO TOTAL TOWNS
      // NOTE: KEEP IN MIND THE TOWNS WITH: "usos y costumbres" EXAMPLE: MICHOACAN HAS CHERAN THEN THIS IS NOT TAKEN
      let totalTowns = this.competitivityBlockCollection.getModels().length
      let filterCollection = this.competitivityBlockCollection.filter({id: 24}) // NOTE: BY CHERAN = 24
      totalTowns = totalTowns - filterCollection.getModels().length
      let totalTownsToTake = Math.round(totalTowns / 3)
      // NOTE: SORT BY CURRENT SELECTED PARTIES
      let orderCollection = _.orderBy(this.competitivityBlockCollection.getModels(), model => {
        return parseFloat(model.get(`${ coaPropName }_%`))
      }, 'desc')
      let taken = 1
      for (let m of orderCollection) {
        let mt = this.activeTowns[m.id]
        // NOTE: 24 IS CHERAN
        if (m.id === 24) {
          m.set('block', '#666666')
          mt.winner.block = m.get('block')
          continue
        } else if (taken <= totalTownsToTake)
          m.set('block', '#28b154')
        else if (taken <= totalTownsToTake * 2)
          m.set('block', '#ffd203')
        else
          m.set('block', '#e8132e')
        mt.winner.block = m.get('block')
        taken++
      }
    },
    addCustomProp (model, propName, value) {
      model._attributes[propName] = value
      model._mutations[propName] = ((isNaN(Number(value)))?String:Number)
      model.set(propName, value)
      this.competitivityBlockModel._attributes[propName] = ((isNaN(Number(value)))?'':0)
      this.competitivityBlockModel._mutations[propName] = ((isNaN(Number(value)))?String:Number)
      this.competitivityBlockModel.set(propName, ((isNaN(Number(value)))?'':0))
      this.competitivityBlockDefaultProps.push(propName)
    },
    addCustomPropB (model, propName, value, defaultProps) {
      model._attributes[propName] = value
      model._mutations[propName] = ((isNaN(Number(value)))?String:Number)
      model.set(propName, value)
      this.partyTownWinnerModel._attributes[propName] = ((isNaN(Number(value)))?'':0)
      this.partyTownWinnerModel._mutations[propName] = ((isNaN(Number(value)))?String:Number)
      this.partyTownWinnerModel.set(propName, ((isNaN(Number(value)))?'':0))
      defaultProps.push(propName)
    },
    removeCustomProp (model, propName, defaultProps) {
      delete model._attributes[propName]
      delete model._mutations[propName]
      defaultProps.splice(1, defaultProps.indexOf(propName))
    },
    clearCustomProps (model, defaultProps) {
      model._attributes = []
      model._mutations = []
      defaultProps = []
    },
    coaExists (model, parties = []) {
      // NOTE: CHECK IF ALREADY EXISTS AND REPLACE THE coaProp
      let coaProp = parties.toString().replaceAll(',', '_')
      let modelAttributes = model._attributes
      let coaExists = false
      for (let p of Object.keys(modelAttributes)) {
        if (p.includes('_') && !p.includes('total_votos')) {
          let exists = true
          for (let coaParty of parties) {
            if (!p.includes(coaParty)) {
              exists = false
              break
            }
          }
          if (exists) {
            coaExists = exists
            coaProp = p
            break
          }
        }
      }
      return {
        prop_name: coaProp,
        exists: coaExists
      }
    },
    removeAccents (str) {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    },
    async generateSVGMap () {
      const converter = new GeoJSON2SVG({
        fitTo: 'width',
        viewportSize: {
          width: 600, height: 600,
        },
        attributes: [
        {
          property: 'properties.name',
          type: 'dynamic',
          key: 'id'
        },
        {
          property: 'properties.name',
          type: 'dynamic'
        }],
        r: 2,
      })
      this.svgItems = await converter.convert(this.geojsonData)
      let items = []
      for (let i of this.svgItems)
        items.push({
          active: '',
          path: i,
          winner: {},
        })
      this.svgItems = items
    },
    leastSquaresLinearRegression (parties) {
      let m = 0
      let n = parties.length
      let Σxy = 0
      let Σx = 0
      let Σy = 0
      let Σxe2 = 0
      for (let i in parties) {
        let x = parseInt(i) + 1
        let y = parseInt(parties[i].total)
        Σxy = Σxy + (x * y)
        Σx = Σx + x
        Σy = Σy + y
        Σxe2 = Σxe2 + (x * x)
      }
      m = (Σxy - ((Σx * Σy) / n)) / (Σxe2 - ((Σx * Σx) / n))
      // NOTE: CALC B
      let b = (Σy / n) - m * (Σx / n)
      return {
        m: m,
        b: b,
        n: n,
      }
    },
    linearRegression (parties) {
      let m = 0
      let n = parties.length
      let x1 = 1
      let x2 = 2
      let y1 = parties[0].total
      let y2 = parties[1].total
      m = (y2 - y1) / (x2 - x1)
      let b = y1 - m * x1
      return {
        m: m,
        b: b,
        n: n,
      }
    },
    renderPlot () {
      try {
        let parties = []
        let coalitionA = this.getSelectedParties(this.plotPartiesA, true)
        let coalitionB = this.getSelectedParties(this.plotPartiesB, true)
        if (!coalitionA.length || !coalitionB.length)
          return

        let coalitionAName = []
        let coalitionATotal = 0
        let coalitionBName = []
        let coalitionBTotal = 0
        let totalGlobalVotes = 0
        for (let p of coalitionA) {
          coalitionAName.push(p.abr)
          let total = parseInt(this.townSelected.winner.data.get(p.abr))
          coalitionATotal = coalitionATotal + total
        }
        for (let p of coalitionB) {
          coalitionBName.push(p.abr)
          let total = parseInt(this.townSelected.winner.data.get(p.abr))
          coalitionBTotal = coalitionBTotal + total
        }
        // NOTE: CALC ALL TOWNS
        let partyTownWinnerVotesData = []
        let morIs = 0
        let partyTownWinnerName = ''
        if (coalitionAName.toString().includes('morena')) {
          morIs = 1
          partyTownWinnerName = coalitionAName.toString()
        } else if (coalitionBName.toString().includes('morena')) {
          morIs = 2
          partyTownWinnerName = coalitionAName.toString()
        }
        this.partyTownWinnerCollection.clear()
        this.partyTownWinnerCollection = new this.$model.ModelMC.collection()
        let partyTownWinnerItems = []
        let coaPropA = `${ coalitionAName.toString().replaceAll(',', '_') }`
        let coaPropB = `${ coalitionBName.toString().replaceAll(',', '_') }`
        this.clearCustomProps(this.partyTownWinnerModel, this.partyTownWinnerDefaultProps)
        for (let town of this.svgItems) {
          if (town.winner.data === undefined)
            continue
          let total = -1
          let totalA = 0
          let totalB = 0
          let townColor = this.$getHexColor(town.winner.name, true)
          for (let pa of coalitionA)
            totalA = totalA + parseInt(town.winner.data.get(pa.abr))
          for (let pb of coalitionB)
            totalB = totalB + parseInt(town.winner.data.get(pb.abr))
          if (morIs === 1 && totalA > totalB)
            total = totalA
          else if (morIs === 2 && totalB > totalA)
            total = totalB
          if (total >= 0) {
            let m = new this.$model.ModelMC.model()
            let p = ((((morIs === 1)?(totalB*100)/totalA:(totalA*100)/totalB)-100)*-1).toFixed(2)
            this.addCustomPropB(m, 'id', town.winner.data.get('id'), this.partyTownWinnerDefaultProps)
            this.addCustomPropB(m, 'municipio', town.winner.name, this.partyTownWinnerDefaultProps)
            this.addCustomPropB(m, coaPropA, totalA, this.partyTownWinnerDefaultProps)
            this.addCustomPropB(m, coaPropB, totalB, this.partyTownWinnerDefaultProps)
            this.addCustomPropB(m, '%', p, this.partyTownWinnerDefaultProps)
            partyTownWinnerItems.push(m)
            partyTownWinnerVotesData.push({
              x: [town.winner.name],
              y: [total],
              mode: 'markers+text',
              type: 'scatter',
              name: town.winner.name,
              text: total,
              marker: {
                size: 10,
                color: townColor,
              },
              textfont : {
                family: 'sans-serif',
                size: 10,
              },
              textposition: 'bottom center',
            })
          }
        }
        this.partyTownWinnerCollection.add(partyTownWinnerItems)
        this.partyTownWinnerDefaultProps = ['id', 'municipio', coaPropA, coaPropB, '%']
        totalGlobalVotes = coalitionATotal + coalitionBTotal
        parties.push({
          name: `COALICIÓN A: ${ coalitionAName.toString().replaceAll(',', ', ') }`,
          total: coalitionATotal,
          color: '#39d964',
        })
        parties.push({
          name: `COALICIÓN B: ${ coalitionBName.toString().replaceAll(',', ', ') }`,
          total: coalitionBTotal,
          color: '#d93939',
        })
        // NOTE: ORDER TOTAL BY DESC
        parties = _.orderBy(parties, m => {
          return Number(m['total'])
        }, 'desc')
        let resultLine = this.leastSquaresLinearRegression(parties)
        let fxExpression = `${ resultLine.m }x + ${ resultLine.b }`
        let fc = (resultLine.m * 100) / resultLine.b
        let p = ''
        if (coalitionATotal > coalitionBTotal)
          p = (((coalitionBTotal * 100 / coalitionATotal) - 100) * -1).toFixed(2)
        else
          p = (((coalitionATotal * 100 / coalitionBTotal) - 100) * -1).toFixed(2)
        if (fc < 0)
          fc = fc * -1
        let fcColor = 0
        if (fc >= 0 && fc <= 14.5)
          fcColor = 1
        else if (fc > 14.5 && fc <= 20)
          fcColor = 2
        else if (fc > 20)
          fcColor = 3
        this.plotExpression = {
          m: resultLine.m,
          b: resultLine.b,
          expression: fxExpression,
          fc: fc,
          fcColor: fcColor,
          percent: `${ p }%`,
        }
        let expr = compile(fxExpression)
        let xValues = range((resultLine.n * 3) * -1, (resultLine.n * 3), 1).toArray()
        let yValues = xValues.map(x => {
          return expr.evaluate({x: x})
        })
        let lineTrace = {
          x: xValues,
          y: yValues,
          type: 'scatter',
          name: 'PENDIENTE',
          marker: {
            size: 1,
            color: 'black',
          },
          textfont : {
            family: 'sans-serif',
            size: 8,
          },
          textposition: 'bottom center',
        }
        // NOTE: RENDER PARTY DOTS TOTAL
        let partyCount = []
        let partyVotes = []
        let partyNames = []
        let partyData = [
          lineTrace,
          ]
        let partyStyle = {
          yaxis: {
            range: [totalGlobalVotes * -0.5, (totalGlobalVotes + (totalGlobalVotes * 0.2))],
            title: 'VOTOS',
          },
          xaxis: {
            autorange: true,
            showgrid: true,
            zeroline: true,
            showline: true,
            title: 'COALICIÓN Y PARTIDOS POLÍTICOS',
          },
          scattergap: 10,
          legend: {
            y: 1,
            yref: 'paper',
            font: {
              family: 'sans-serif',
              size: 10,
              color: '#616161',
            }
          },
          title: '...',
        }
        for (let i in parties) {
          partyCount = []
          partyVotes = []
          partyNames = []
          partyCount.push(parseInt(i) + 1)
          partyNames.push(parties[i].name)
          partyVotes.push(parties[i].total)
          partyData.push({
            x: partyCount,
            y: partyVotes,
            mode: 'markers+text',
            type: 'scatter',
            name: parties[i].name.replaceAll('_', ' ').toUpperCase(),
            text: partyNames,
            marker: {
              size: 10,
              color: parties[i].color,
            },
            textfont : {
              family: 'sans-serif',
              size: 10,
            },
            textposition: 'bottom center',
          })
        }
        Plotly.newPlot(
          this.$refs['gd'],
          partyData,
          partyStyle,
          { editable: false })
        // NOTE: RENDER FOR TOWN WINNER
        let plotTownWinnerStyle = {
          yaxis: {
            autorange: true,
            showgrid: true,
            zeroline: true,
            showline: true,
            title: 'VOTOS',
          },
          xaxis: {
            autorange: true,
            showgrid: true,
            zeroline: true,
            showline: true,
            title: '',
          },
          scattergap: 10,
          legend: {
            y: 1,
            yref: 'paper',
            font: {
              family: 'sans-serif',
              size: 10,
              color: '#616161',
            }
          },
          title: partyTownWinnerName.replaceAll(',', ', '),
        }
        Plotly.newPlot(
          this.$refs['plotTownWinner'],
          partyTownWinnerVotesData,
          plotTownWinnerStyle,
          { editable: false })
      } catch (err) {
        console.error(err)
      } finally {

      }
    },
    onTownClick (index) {
      this.townSelected = null
      if (this.sectionActive === 'results') {
        this.townSelected = this.svgItems[index]
        this.generateChart()
        setTimeout(this.renderPlot, 50)
        this.$emitter.emit('town-selected', this.townSelected)
      } else if (this.sectionActive === 'blocks') {
        let townId = this.svgItems[index].winner.id
        let townResultData = this.svgItems[index]
        let value = this.svgItems[index].active
        if (value === 'active') {
          value = ''
          delete this.activeTowns[townId]
        } else {
          value = 'active'
          this.activeTowns[townId] = townResultData
        }
        this.svgItems[index].active = value
        this.generateCompetitivityBlocks()
      } else if (this.sectionActive === 'candidates') {
        this.townSelected = this.svgItems[index]
        this.candidateTownName = this.svgItems[index].winner.data.get('name').toLowerCase()
        let collection = this.candidateRegidorGroupCollection.filter(m => {
          let modelTownName = this.removeAccents(m.get('municipio').toLowerCase())
          let res = !!(modelTownName == this.candidateTownName)
          return res
        })
        if (collection.getModels().length)
          this.candidateTown = collection.getModels()[0]
      }
    },
    onTownOver (index) {
      this.currentTownName = this.svgItems[index].winner.name
    },
    onTownLeave () {
      this.currentTownName = ''
    },
    generateChart () {
      let chartDataSets = []
      for (let key of Object.keys(this.colors)) {
        if (key === 'activo')
          continue

        let color = this.colors[key]
        let label = key.replaceAll('_', ' ')
        let total = this.townSelected.winner.data.get(key)
        chartDataSets.push({
          label: label,
          backgroundColor: color,
          data: [
            total,
          ],
        })
      }
      this.chartData.datasets = chartDataSets
      this.chartData.labels = ['PARTIDOS POLÍTICOS']
      this.chartAKey = this.$uuid.v1()
    },
    selectAllTowns () {
      for (let index in this.svgItems) {
        let townId = this.svgItems[index].winner.id
        if (townId === undefined)
          continue

        let townResultData = this.svgItems[index]
        this.activeTowns[townId] = townResultData
        this.svgItems[index].active = 'active'
      }
      this.generateCompetitivityBlocks()
    },
    unselectAllTowns () {
      this.activeTowns = {}
      for (let svgItem of this.svgItems) {
        svgItem.active = ''
        svgItem.winner.block = '#888888'
      }
      this.generateCompetitivityBlocks()
    },
    onClickPoliticParty (party) {
      if (party.active) {
        let selectedParties = this.getSelectedParties(this.parties)
        for (let sp of selectedParties) {
          this.removeCustomProp(this.competitivityBlockModel, `${ sp }_%`, this.competitivityBlockDefaultProps)
          this.removeCustomProp(this.competitivityBlockModel, `${ sp }_total`, this.competitivityBlockDefaultProps)
        }
        let coaPropName = selectedParties.toString().replaceAll(',', '_')
        this.removeCustomProp(this.competitivityBlockModel, `${ coaPropName }_%`, this.competitivityBlockDefaultProps)
        this.removeCustomProp(this.competitivityBlockModel, `${ coaPropName }_total`, this.competitivityBlockDefaultProps)
        this.removeCustomProp(this.competitivityBlockModel, `${ coaPropName }_coa_total`, this.competitivityBlockDefaultProps)
      }
      party.active = !party.active
      this.generateCompetitivityBlocks()
    },
    onClickPoliticPlotParty (party) {
      party.active = !party.active
      this.renderPlot()
    },
    onChangeCheckbox (propName) {
      switch (propName) {
        case 'results':
          this.townSelected = null
          this.showBlocksInMap = false
          this.selectAll = false
          this.sectionActive = propName
        break
        case 'blocks':
          this.townSelected = null
          this.sectionActive = propName
        break
        case 'candidates':
          this.townSelected = null
          this.sectionActive = propName
          this.candidateTabIcons[0].show = true
        break
        case 'blocks-map':
          this.showBlocksInMap = !this.showBlocksInMap
        break
        case 'select-all':
          this.selectAll = !this.selectAll
          if (this.selectAll)
            this.selectAllTowns()
          else
            this.unselectAllTowns()
        break
        case 'take-coa-votes':
          this.takeCoaVotes = !this.takeCoaVotes
          this.generateCompetitivityBlocks()
        break
      }
    },
    getSelectedParties (parties, getAll = false) {
      let selectedParties = []
      for (let p of parties)
        if (p.active) {
          if (getAll)
            selectedParties.push(p)
          else
            selectedParties.push(p.abr)
        }
      return selectedParties
    },
    showCard () {
      this.cardModalData = {
        modalTitle: 'ficha',
        modalDescription: this.townSelected.winner.party.replaceAll('_', ', '),
        modalAccept: this.hideCard,
        modalModel: this.townSelected.winner,
        modalId: this.townSelected.winner.id,
      }
      this.$emitter.emit('card-modal', this.cardModalData)
    },
    hideCard () {
      this.$emitter.emit('card-modal', null)
    },
    showCandidateCard (type) {
      let model = null
      let collection = null
      let localDistrictArr = this.townSelected.winner.data.get('local_district')
      let modalDescription = ''
      if (type === 'presidente') {
        model = this.candidateModel
        modalDescription = 'candidatos a Presidente'
        collection = this.candidatePresidenteCollection.filter(m => {
          return localDistrictArr.includes(m.get('distrito_local'))
        })
      } else if (type === 'diputado') {
        model = this.candidateModel
        modalDescription = 'diputados'
        collection = this.candidateDiputadoCollection.filter(m => {
          return localDistrictArr.includes(m.get('distrito_local'))
        })
      } else if (type === 'sindico') {
        model = this.candidateModel
        modalDescription = 'síndicos'
        collection = this.candidateSindicoCollection.filter(m => {
          return localDistrictArr.includes(m.get('distrito_local'))
        })
      } else if (type === 'regidor') {
        model = this.baseModel
        modalDescription = 'regidores'
        collection = this.candidateBaseCollection.filter(m => {
          let type = m.get('posible_cargo').toLowerCase()
          return (type === 'regidor' && localDistrictArr.includes(m.get('distrito_local')))
        })
      }
      this.candidateModalData = {
        modalTitle: this.townSelected.winner.name,
        modalDescription: modalDescription,
        modalAccept: this.hideCandidateCard,
        modalModel: model,
        modalCollection: collection,
        modalId: this.townSelected.winner.id,
      }
      this.$emitter.emit('candidate-modal', this.candidateModalData)
    },
    hideCandidateCard () {
      this.$emitter.emit('candidate-modal', null)
    },
  },
}
</script>

<style scoped lang="css">
.accent {
  color: var(--main-text-color);
  font-size: 28px;
  line-height: 20px;
  margin: auto;
  padding: 0 8px;
  font-weight: 600;
}

#wrapper {
  display: flex;
  flex-direction: column;
}

#custom {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

#map {
  width: 650px;
  height: 450px;
  fill: var(--main-box-bg-color);
  stroke: #dddddd;
  stroke-width: 1;
  margin: auto;
  filter: drop-shadow(0px 10px 10px rgb(0 0 0 / 50%));
}

a.town {
  cursor: pointer;
  transition-duration: 500ms !important;
}

a.town:hover {
/*  stroke: var(--main-secondary-text-color);*/
  fill: var(--main-box-bg-color) !important;
}

a.town.active {
  fill: var(--main-accent-color) !important;
/*  stroke: var(--main-accent-color) !important;*/
  stroke-width: 2;
}


#politic-parties {
  align-self: center;
  display: flex;
  height: 45px;
  justify-content: center;
}

#politic-parties-items {
  align-self: center;
  display: flex;
  gap: 8px;
  z-index: 2;
}

.button {
  position: relative;
  overflow: hidden;
  display: flex;
  height: 45px;
  width: 45px;
  cursor: pointer;
}

.button:hover img {
  border-bottom: 2px solid var(--main-active-color);
}

.button.active img {
  border-bottom: 2px solid  var(--main-accent-color);
}

.button img {
  margin: auto;
  left: -10px;
  right: -10px;
  position: absolute;
  top: -10px;
  bottom: -10px;
  width: calc(100% - 10px);
  border-bottom: 2px solid #00000000;
}

#float-left {
  position: absolute;
  z-index: 1;
  left: 6px;
  margin: auto;
  top: 80px;
}

#float-right {
  position: absolute;
  z-index: 1;
  right: 6px;
  margin: auto;
  top: 80px;
}

#map-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
}

.item-definition {
  display: flex;
  height: 25px;
  align-items: center;
}

.item-definition .icon {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.item-definition .text {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  text-transform: uppercase;
  padding: 0 0 0 6px;
  line-height: var(--main-font-size);
  margin: auto 0 auto 0;
}

.item-definition .text span {
  font-weight: bold;
}

.item-definition.center {
  display: flex;
  justify-content: center;
}

.bar-tool {
  display: flex;
  justify-content: center;
  max-width: 800px;
  gap: 12px;
  margin: 12px auto;
  height: 32px;
}

#town-name {
  color: var(--main-text-color);
  font-size: var(--main-font-size);
  text-transform: uppercase;
  padding: 0;
  line-height: var(--main-font-size);
  margin: auto;
  display: flex;
  justify-content: center;
  pointer-events: none;
  height: 16px;
  margin: 10px auto;
  font-weight: bold;
}

#color-wrapper {
  height: 24px;
  width: 24px;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: var(--main-box-shadow);
  margin: auto;
  display: flex;
  align-self: center;
}

.color-a {
  background-color: #ff0303;
  height: 100%;
  width: 100%;
}

.color-b {
  background-color: #ffd203;
  height: 100%;
  width: 100%;
}

.color-c {
  background-color: #7fff03;
  height: 100%;
  width: 100%;
}

#coa-parties {
  max-width: 350px;
  margin: auto auto 25px auto;
}


#sections {
  display: flex;
  gap: 12px;
}

#sections > .option {
  color: var(--main-text-color);
  font-size: var(--main-accent-font-size);
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
}

#sections > .option:after {
  content: "";
  position: absolute;
  bottom: -8px;
  margin: auto;
  width: calc(100% - 25%);
  height: 3px;
  left: 0;
  right: 0;
}

#sections > .option:hover:after {
  background-color: var(--main-active-color);
}

#sections > .option.active:after {
  background-color: var(--main-accent-color);
}

#district-colors {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#blocks {
  display: flex;
  gap: 48px;
  margin: 16px 6px;
}

#blocks > div {
  padding: 24px;
  box-shadow: var(--main-box-shadow);
  border-radius: 8px;
}


h2 {
  align-self: center;
  color: var(--main-accent-color);
  display: flex;
  flex-grow: 1;
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  letter-spacing: .8px;
  margin: 0;
  text-transform: uppercase;
}

h3 {
  align-self: center;
  color: var(--main-text-color);
  display: flex;
  flex-grow: 1;
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  text-transform: uppercase;
  margin: 24px 12px 12px 12px;
}

</style>
