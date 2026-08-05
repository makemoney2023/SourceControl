export class RequestSequence {
  private current = 0;
  private mounted = true;

  begin(): number {
    return ++this.current;
  }

  beginIfMounted(): number | null {
    return this.mounted ? this.begin() : null;
  }

  mount(): void {
    this.mounted = true;
  }

  isCurrent(id: number): boolean {
    return this.mounted && id === this.current;
  }

  isMounted(): boolean {
    return this.mounted;
  }

  async publishLatest<T>(
    request: Promise<T>,
    publish: (value: T) => void,
  ): Promise<boolean> {
    const id = this.beginIfMounted();
    if (id == null) return false;
    const value = await request;
    if (!this.isCurrent(id)) return false;
    publish(value);
    return true;
  }

  unmount(): void {
    this.mounted = false;
    this.current += 1;
  }
}

export class ManualActivityCounter {
  private count = 0;
  get active(): boolean {
    return this.count > 0;
  }
  begin(): void {
    this.count += 1;
  }
  end(): void {
    this.count = Math.max(0, this.count - 1);
  }

  endAndShouldPublish(sequence: RequestSequence): boolean {
    this.end();
    return !this.active && sequence.isMounted();
  }
}
