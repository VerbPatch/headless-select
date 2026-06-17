import { ReactiveController, ReactiveControllerHost } from 'lit';
import { useSelect, SelectConfig, SelectState, SelectInstance } from '@verbpatch/headless-select';

export class SelectController implements ReactiveController {
  private host: ReactiveControllerHost;
  public instance: SelectInstance;
  public state: SelectState;
  private unsubscribe?: () => void;

  constructor(host: ReactiveControllerHost, config: SelectConfig) {
    this.host = host;
    this.instance = useSelect(config);
    this.state = this.instance.getState();
    host.addController(this);
  }

  hostConnected() {
    this.unsubscribe = this.instance.subscribe((state) => {
      this.state = state;
      this.host.requestUpdate();
    });
  }

  hostDisconnected() {
    this.unsubscribe?.();
    this.instance.destroy();
  }

  updateConfig(patch: Partial<SelectConfig>) {
    this.instance.setConfig(patch);
  }
}
