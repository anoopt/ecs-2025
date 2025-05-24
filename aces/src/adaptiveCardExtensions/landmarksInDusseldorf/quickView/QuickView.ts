import { BaseWebQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import {
  ILandmarksInDusseldorfAdaptiveCardExtensionProps,
  ILandmarksInDusseldorfAdaptiveCardExtensionState
} from '../LandmarksInDusseldorfAdaptiveCardExtension';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LandmarksAccordion } from './components/landmarkAccordion';

export interface IQuickViewData {
  subTitle: string;
  title: string;
}

export class QuickView extends BaseWebQuickView<
  ILandmarksInDusseldorfAdaptiveCardExtensionProps,
  ILandmarksInDusseldorfAdaptiveCardExtensionState
> {
  render(): void {
    const { allowMultipleExpanded } = this.properties;
    const { aadHttpClientFactory } = this.state;
    const element: React.ReactElement<{}> = React.createElement(LandmarksAccordion, {
      aadHttpClientFactory,
      allowMultipleExpanded,
      theme: this.state.theme
    });
    ReactDOM.render(element, this.domElement);
  }

  public onDispose(): void {
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.dispose();
  }
}
