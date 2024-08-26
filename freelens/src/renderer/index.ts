import "@freelensapp/core/styles";
import "@freelensapp/button/styles";
import "@freelensapp/error-boundary/styles";
import "@freelensapp/tooltip/styles";
import "@freelensapp/resizing-anchor/styles";
import "@freelensapp/icon/styles";
import "@freelensapp/animate/styles";
import "@freelensapp/notifications/styles";
import "@freelensapp/spinner/styles";

import { runInAction } from "mobx";
import {
  rendererExtensionApi as Renderer,
  commonExtensionApi as Common,
  registerLensCore,
  metricsFeature,
} from "@freelensapp/core/renderer";
import { autoRegister } from "@ogre-tools/injectable-extension-for-auto-registration";
import { registerFeature } from "@freelensapp/feature-core";
import {
  applicationFeature,
  startApplicationInjectionToken
} from "@freelensapp/application";
import { createContainer } from "@ogre-tools/injectable";
import { registerMobX } from "@ogre-tools/injectable-extension-for-mobx";
import { registerInjectableReact } from "@ogre-tools/injectable-react";
import { messagingFeatureForRenderer } from "@freelensapp/messaging-for-renderer";
import { keyboardShortcutsFeature } from "@freelensapp/keyboard-shortcuts";
import { reactApplicationFeature } from "@freelensapp/react-application";
import { routingFeature } from "@freelensapp/routing";
import { loggerFeature } from "@freelensapp/logger";
import { animateFeature } from "@freelensapp/animate";
import { clusterSidebarFeature } from "@freelensapp/cluster-sidebar";
import { randomFeature } from "@freelensapp/random";
import { kubeApiSpecificsFeature } from "@freelensapp/kube-api-specifics";
import { notificationsFeature } from "@freelensapp/notifications";

const environment = "renderer";

const di = createContainer(environment, {
  detectCycles: false,
});

runInAction(() => {
  registerMobX(di);
  registerInjectableReact(di);
  registerLensCore(di, environment);

  registerFeature(
    di,
    loggerFeature,
  );

  registerFeature(
    di,
    applicationFeature,
    messagingFeatureForRenderer,
    keyboardShortcutsFeature,
    reactApplicationFeature,
    routingFeature,
    metricsFeature,
    animateFeature,
    clusterSidebarFeature,
    randomFeature,
    kubeApiSpecificsFeature,
    notificationsFeature,
  );

  autoRegister({
    di,
    targetModule: module,
    getRequireContexts: () => [
      require.context("./", true, CONTEXT_MATCHER_FOR_NON_FEATURES),
      require.context("../common", true, CONTEXT_MATCHER_FOR_NON_FEATURES),
    ],
  });
});

const startApplication = di.inject(startApplicationInjectionToken);

startApplication();

export {
  React,
  ReactDOM,
  ReactRouter,
  ReactRouterDom,
  Mobx,
  MobxReact,
} from "@freelensapp/core/renderer";

export const LensExtensions = {
  Renderer,
  Common,
};
