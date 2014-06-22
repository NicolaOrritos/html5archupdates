window._skel_config = {
	prefix: 'css/style',
	preloadStyleSheets: true,
	resetCSS: true,
	boxModel: 'border',
	grid: { gutters: 4 },
	breakpoints: {
		wide: { range: '1200-', containers: 1140, grid: { gutters: 6 } },
		narrow: { range: '481-1199', containers: 960 },
		narrower: { range: '481-960', containers: 'fluid' },
		mobile: { range: '-480', containers: 'fluid', lockViewport: true, grid: { collapse: true, gutters: 10 } }
	}
};

window._skel_panels_config = {
	panels: {
		leftPanel: {
			breakpoints: 'narrower,mobile',
			position: 'left',
			size: 250,
			html: '<div data-action="moveCell" data-args="left-sidebar,content"></div>'
		},
		rightPanel: {
			breakpoints: 'narrower,mobile',
			position: 'right',
			size: 250,
			html: '<div data-action="moveCell" data-args="right-sidebar,content"></div>'
		},
		bottomPanel: {
			position: 'bottom',
			size: 420
			/*
				Since this panel is a bit more complicated, we're omitting its 'html' option and
				defining it inline (ie. in index.html).
			*/
		}
	},
	overlays: {
		leftPanelButton: {
			breakpoints: 'narrower,mobile',
			position: 'top-left',
			width: "auto",
			height: "auto",
			html: '<div class="toggle icon-chevron-right" data-action="togglePanel" data-args="leftPanel"></div>'
		},
		rightPanelButton: {
			breakpoints: 'narrower,mobile',
			position: 'top-right',
			width: "auto",
			height: "auto",
			html: '<div class="toggle icon-chevron-left" data-action="togglePanel" data-args="rightPanel"></div>'
		}
	}
};