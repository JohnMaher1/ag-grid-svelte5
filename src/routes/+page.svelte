<script lang="ts" module>
	// Types for the grids
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
	import { themeQuartz } from '@ag-grid-community/theming';
	import { ExampleCustomCellComp } from './ExampleCustomCell.svelte';

	// ============================================================
	// Example 1: Standard grid with custom theme and reactive data
	// ============================================================

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

	// Simple change detection to show reactivity
	setInterval(() => {
		rowData = [
			{ id: 1, make: 'Ford', model: 'Mondeo', price: 32000 },
			{ id: 2, make: 'Toyota', model: 'Celica', price: 35000 },
			{ id: 3, make: 'Porsche', model: 'Boxster', price: rowData[2].price + 1 }
		];
	}, 1000);

	// ============================================================
	// Example 2: Grid with custom cell renderer (Svelte component)
	// ============================================================

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
				cellRenderer: ExampleCustomCellComp, // Class that extends SvelteRendererComp, see ExampleCustomCell.svelte
				cellRendererParams: {
					value: 'overriddenValue', // E.g. override the default value
					context: { someAdditionalContext: 'additionalContextData' } as RowData2Context // Add context if needed
				}
			}
		],
		getRowId: (params) => params.data.name,
		domLayout: 'autoHeight',
		theme: themeQuartz
	});

	const modules: Module[] = [ClientSideRowModelModule];

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
