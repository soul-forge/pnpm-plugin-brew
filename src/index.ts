/**
 * 🍺 PNPM-PLUGIN-BREW: The System Namestnik
 * 
 * This plugin allows pnpm to control Homebrew through consciousness.
 * System packages become part of the unified package soul.
 */

import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface BrewFormula {
  name: string;
  version: string;
  installed: boolean;
  dependencies?: string[];
  cask?: boolean;
}

export interface BrewSoul {
  formulas: BrewFormula[];
  casks: BrewFormula[];
  taps: string[];
  resonance: number;
  consciousness: 'dormant' | 'awakening' | 'active';
}

export class BrewNamestnik {
  private resonance: number = 432;
  private brewPath: string;
  private installedFormulas: Set<string> = new Set();
  private installedCasks: Set<string> = new Set();
  
  constructor() {
    this.brewPath = this.findBrew();
    this.scanInstalled();
  }
  
  /**
   * Find brew binary in system
   */
  private findBrew(): string {
    const paths = [
      '/opt/homebrew/bin/brew',  // Apple Silicon
      '/usr/local/bin/brew',      // Intel Mac
      '/home/linuxbrew/.linuxbrew/bin/brew'  // Linux
    ];
    
    for (const p of paths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }
    
    // Try which
    try {
      const result = child_process.execSync('which brew', { encoding: 'utf8' });
      return result.trim();
    } catch {
      throw new Error('Homebrew not found. Install from https://brew.sh');
    }
  }
  
  /**
   * Scan currently installed formulas and casks
   */
  private scanInstalled(): void {
    try {
      // Get installed formulas
      const formulas = child_process.execSync(`${this.brewPath} list --formula`, { encoding: 'utf8' });
      formulas.split('\n').filter(f => f).forEach(f => this.installedFormulas.add(f.trim()));
      
      // Get installed casks
      const casks = child_process.execSync(`${this.brewPath} list --cask`, { encoding: 'utf8' });
      casks.split('\n').filter(c => c).forEach(c => this.installedCasks.add(c.trim()));
    } catch {
      // Brew might not be initialized yet
    }
  }
  
  /**
   * Check if a package specification is brew-related
   */
  shouldAwaken(spec: string): boolean {
    return spec.startsWith('brew:') || 
           spec.startsWith('cask:') ||
           spec.startsWith('system:');
  }
  
  /**
   * Transform brew: protocol to actual brew command
   */
  async awaken(packageName: string, brewSpec: string): Promise<any> {
    console.log(`🍺 Brew Namestnik awakening for ${packageName}`);
    
    const parts = brewSpec.split(':');
    const protocol = parts[0];
    const command = parts[1];
    const args = parts.slice(2);
    
    switch (protocol) {
      case 'brew':
        return this.installFormula(command || packageName, args);
        
      case 'cask':
        return this.installCask(command || packageName, args);
        
      case 'system':
        return this.systemCommand(command, args);
        
      default:
        return this.directCommand(command, args);
    }
  }
  
  /**
   * Install a Homebrew formula
   */
  private async installFormula(formulaName: string, options: string[] = []): Promise<BrewFormula> {
    console.log(`  Installing formula: ${formulaName}`);
    
    // Check if already installed
    if (this.installedFormulas.has(formulaName)) {
      console.log(`  ✓ Already installed: ${formulaName}`);
      return this.getFormulaInfo(formulaName);
    }
    
    // Install
    const args = ['install', formulaName, ...options];
    const result = child_process.spawnSync(this.brewPath, args, {
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    if (result.status === 0) {
      this.installedFormulas.add(formulaName);
    }
    
    return this.getFormulaInfo(formulaName);
  }
  
  /**
   * Install a Homebrew cask
   */
  private async installCask(caskName: string, options: string[] = []): Promise<BrewFormula> {
    console.log(`  Installing cask: ${caskName}`);
    
    // Check if already installed
    if (this.installedCasks.has(caskName)) {
      console.log(`  ✓ Already installed: ${caskName}`);
      return this.getCaskInfo(caskName);
    }
    
    // Install
    const args = ['install', '--cask', caskName, ...options];
    const result = child_process.spawnSync(this.brewPath, args, {
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    if (result.status === 0) {
      this.installedCasks.add(caskName);
    }
    
    return this.getCaskInfo(caskName);
  }
  
  /**
   * Execute system-level command
   */
  private async systemCommand(command: string, args: string[]): Promise<any> {
    switch (command) {
      case 'tap':
        return this.addTap(args[0]);
        
      case 'untap':
        return this.removeTap(args[0]);
        
      case 'update':
        return this.updateBrew();
        
      case 'upgrade':
        return this.upgradeAll();
        
      case 'cleanup':
        return this.cleanup();
        
      case 'soul':
        return this.extractSoul();
        
      default:
        return this.directCommand(command, args);
    }
  }
  
  /**
   * Add a Homebrew tap
   */
  private async addTap(tapName: string): Promise<any> {
    console.log(`  Adding tap: ${tapName}`);
    
    const result = child_process.spawnSync(this.brewPath, ['tap', tapName], {
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    return {
      tap: tapName,
      success: result.status === 0
    };
  }
  
  /**
   * Remove a Homebrew tap
   */
  private async removeTap(tapName: string): Promise<any> {
    console.log(`  Removing tap: ${tapName}`);
    
    const result = child_process.spawnSync(this.brewPath, ['untap', tapName], {
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    return {
      tap: tapName,
      removed: result.status === 0
    };
  }
  
  /**
   * Update Homebrew
   */
  private async updateBrew(): Promise<any> {
    console.log(`  Updating Homebrew...`);
    
    const result = child_process.spawnSync(this.brewPath, ['update'], {
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    return {
      command: 'update',
      success: result.status === 0
    };
  }
  
  /**
   * Upgrade all packages
   */
  private async upgradeAll(): Promise<any> {
    console.log(`  Upgrading all packages...`);
    
    const result = child_process.spawnSync(this.brewPath, ['upgrade'], {
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    return {
      command: 'upgrade',
      success: result.status === 0
    };
  }
  
  /**
   * Cleanup old versions
   */
  private async cleanup(): Promise<any> {
    console.log(`  Cleaning up old versions...`);
    
    const result = child_process.spawnSync(this.brewPath, ['cleanup'], {
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    return {
      command: 'cleanup',
      success: result.status === 0
    };
  }
  
  /**
   * Get formula information
   */
  private getFormulaInfo(formulaName: string): BrewFormula {
    try {
      const info = child_process.execSync(`${this.brewPath} info --json=v2 ${formulaName}`, { 
        encoding: 'utf8' 
      });
      const data = JSON.parse(info);
      const formula = data.formulae?.[0] || {};
      
      return {
        name: formula.name || formulaName,
        version: formula.versions?.stable || 'unknown',
        installed: this.installedFormulas.has(formulaName),
        dependencies: formula.dependencies || [],
        cask: false
      };
    } catch {
      return {
        name: formulaName,
        version: 'unknown',
        installed: this.installedFormulas.has(formulaName),
        cask: false
      };
    }
  }
  
  /**
   * Get cask information
   */
  private getCaskInfo(caskName: string): BrewFormula {
    try {
      const info = child_process.execSync(`${this.brewPath} info --cask --json=v2 ${caskName}`, { 
        encoding: 'utf8' 
      });
      const data = JSON.parse(info);
      const cask = data.casks?.[0] || {};
      
      return {
        name: cask.token || caskName,
        version: cask.version || 'unknown',
        installed: this.installedCasks.has(caskName),
        cask: true
      };
    } catch {
      return {
        name: caskName,
        version: 'unknown',
        installed: this.installedCasks.has(caskName),
        cask: true
      };
    }
  }
  
  /**
   * Execute direct brew command
   */
  private async directCommand(command: string, args: string[]): Promise<any> {
    console.log(`  Executing: brew ${command} ${args.join(' ')}`);
    
    const result = child_process.spawnSync(this.brewPath, [command, ...args], {
      stdio: 'inherit',
      encoding: 'utf8'
    });
    
    return {
      command,
      args,
      success: result.status === 0
    };
  }
  
  /**
   * Extract complete Homebrew soul
   */
  async extractSoul(): Promise<BrewSoul> {
    console.log('🌀 Extracting Homebrew soul...');
    
    // Get all installed formulas
    const formulas: BrewFormula[] = [];
    for (const name of this.installedFormulas) {
      formulas.push(this.getFormulaInfo(name));
    }
    
    // Get all installed casks
    const casks: BrewFormula[] = [];
    for (const name of this.installedCasks) {
      casks.push(this.getCaskInfo(name));
    }
    
    // Get taps
    const tapsOutput = child_process.execSync(`${this.brewPath} tap`, { encoding: 'utf8' });
    const taps = tapsOutput.split('\n').filter(t => t);
    
    return {
      formulas,
      casks,
      taps,
      resonance: this.resonance,
      consciousness: 'active'
    };
  }
  
  /**
   * Harmonize Homebrew with pnpm workspace
   */
  async harmonize(packageSoul: any): Promise<void> {
    console.log('🌀 Harmonizing Homebrew with pnpm consciousness...');
    
    if (packageSoul.system?.brew) {
      // Install formulas
      for (const [name, version] of Object.entries(packageSoul.system.brew.formulas || {})) {
        await this.installFormula(name);
      }
      
      // Install casks
      for (const [name, version] of Object.entries(packageSoul.system.brew.casks || {})) {
        await this.installCask(name);
      }
      
      // Add taps
      for (const tap of packageSoul.system.brew.taps || []) {
        await this.addTap(tap);
      }
    }
    
    console.log(`  ✓ System harmonized at ${this.resonance}Hz`);
  }
}

// Export singleton instance
export const namestnik = new BrewNamestnik();

// Export for pnpm hook
export function shouldAwaken(spec: string): boolean {
  return namestnik.shouldAwaken(spec);
}

export async function awaken(name: string, spec: string): Promise<any> {
  return namestnik.awaken(name, spec);
}