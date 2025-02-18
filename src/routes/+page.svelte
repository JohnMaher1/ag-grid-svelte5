<script lang="ts" module>
	export interface RowData1 {
		make: string;
		model: string;
		price: number;
		id: number;
	}
	export interface RowData2 {
		name: string;
		desc: string;
	}

	export interface RowData2Context {
		someAdditionalContext: string;
	}
</script>

<script lang="ts">
	import AgGridSvelte5Component from '$lib/AgGridComponent.svelte';
	import { type GridOptions, type ColDef, type Module } from '@ag-grid-community/core';
	import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
	import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
	import { themeQuartz } from '@ag-grid-community/theming';
	import { ExampleCustomCellComp } from './ExampleCustomCell.svelte';

	let rowData: RowData1[] = $state([
		{ id: 1, make: 'Toyota', model: 'Celica', price: 35000 },
		{ id: 2, make: 'Ford', model: 'Mondeo', price: 32000 },
		{ id: 3, make: 'Porsche', model: 'Boxster', price: 72000 }
	]);
	let gridOptions: GridOptions<RowData1> = $state({
		columnDefs: [{ field: 'id' }, { field: 'make' }, { field: 'model' }, { field: 'price' }],
		// Important for reducing dom updates and improving performance
		getRowId: (params) => params.data.id.toString(),
		domLayout: 'autoHeight',
		theme: themeQuartz
	});

	setInterval(() => {
		rowData = [
			{ id: 1, make: 'Ford', model: 'Mondeo', price: 32000 },
			{ id: 2, make: 'Toyota', model: 'Celica', price: 35000 },
			{ id: 3, make: 'Porsche', model: 'Boxster', price: rowData[2].price + 1 }
		];
	}, 1000);

	let rowDataTwo: RowData2[] = $state([
		{ name: 'John', desc: 'Desc1' },
		{ name: 'Jane', desc: 'Desc2' },
		{ name: 'Jack', desc: 'Desc3' }
	]);

	let gridOptionsTwo: GridOptions<RowData2> = $state({
		columnDefs: [
			{ field: 'name' },
			{
				field: 'desc',
				cellRenderer: ExampleCustomCellComp,
				cellRendererParams: {
					value: 'overriddenValue', // E.g. override the default value
					context: { someAdditionalContext: 'additionalContextData' } as RowData2Context // Add extra custom context if needed
				}
			}
		],
		// Important for reducing dom updates and improving performance
		getRowId: (params) => params.data.name,
		domLayout: 'autoHeight',
		theme: themeQuartz
	});

	const modules: Module[] = [ClientSideRowModelModule, RowGroupingModule];

	// to use themeOne in an application, pass it to the theme grid option
	const themeOne = themeQuartz.withParams({
		accentColor: '#EE28ED',
		backgroundColor: '#1f2836',
		browserColorScheme: 'dark',
		chromeBackgroundColor: {
			ref: 'foregroundColor',
			mix: 0.07,
			onto: 'backgroundColor'
		},
		foregroundColor: '#FFF',
		headerFontSize: 14
	});

	const themeTwo = themeQuartz.withParams({
		accentColor: '#33E34B',
		backgroundColor: '#b7b3b3',
		browserColorScheme: 'light',
		chromeBackgroundColor: {
			ref: 'foregroundColor',
			mix: 0.07,
			onto: 'backgroundColor'
		},
		foregroundColor: '#000',
		headerFontSize: 14
	});

	let selectedTheme = $state(themeOne);
</script>

<div>
	<button
		style="margin-bottom: 8px;"
		onclick={() => (selectedTheme = selectedTheme === themeOne ? themeTwo : themeOne)}
		>Change Theme</button
	>
	<AgGridSvelte5Component {gridOptions} {rowData} theme={selectedTheme} {modules} />
	<div style="height: 20px;"></div>
	<AgGridSvelte5Component
		gridOptions={gridOptionsTwo}
		rowData={rowDataTwo}
		theme={selectedTheme}
		{modules}
	/>
</div>
