export interface GPU {
  name: string;
  vendor: string;
  vram: number; // GB
  fp16: number; // TFLOPS
  fp32: number; // TFLOPS
  cloudPricePerHr: number; // USD
  availability: 'high' | 'medium' | 'low';
  tdp: number; // Watts
  type: 'datacenter' | 'consumer' | 'tpu';
}

export const gpuData: GPU[] = [
  { name: 'H100 SXM', vendor: 'NVIDIA', vram: 80, fp16: 1979, fp32: 67, cloudPricePerHr: 3.20, availability: 'medium', tdp: 700, type: 'datacenter' },
  { name: 'H200 SXM', vendor: 'NVIDIA', vram: 141, fp16: 1979, fp32: 67, cloudPricePerHr: 4.50, availability: 'low', tdp: 700, type: 'datacenter' },
  { name: 'A100 80GB', vendor: 'NVIDIA', vram: 80, fp16: 312, fp32: 19.5, cloudPricePerHr: 2.10, availability: 'high', tdp: 400, type: 'datacenter' },
  { name: 'L40S', vendor: 'NVIDIA', vram: 48, fp16: 733, fp32: 91.6, cloudPricePerHr: 1.60, availability: 'high', tdp: 350, type: 'datacenter' },
  { name: 'RTX 4090', vendor: 'NVIDIA', vram: 24, fp16: 330, fp32: 82.6, cloudPricePerHr: 0.80, availability: 'high', tdp: 450, type: 'consumer' },
  { name: 'MI300X', vendor: 'AMD', vram: 192, fp16: 1307, fp32: 163, cloudPricePerHr: 2.80, availability: 'medium', tdp: 750, type: 'datacenter' },
  { name: 'TPU v5e', vendor: 'Google', vram: 16, fp16: 197, fp32: 197, cloudPricePerHr: 1.20, availability: 'medium', tdp: 170, type: 'tpu' },
  { name: 'TPU v5p', vendor: 'Google', vram: 95, fp16: 459, fp32: 459, cloudPricePerHr: 4.20, availability: 'low', tdp: 450, type: 'tpu' },
];
