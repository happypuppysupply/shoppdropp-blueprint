'use client'

import { Package, ExternalLink, TrendingUp, Star, DollarSign, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  title: string
  description?: string
  price: number
  currency: string
  image_url?: string
  rating?: number
  reviews_count?: number
  sales_count?: number
  source: 'amazon' | 'walmart' | 'ebay'
  product_url: string
  in_stock: boolean
  profitability?: {
    profitability: 'high' | 'medium' | 'low'
    estimated_margin: number
    recommendation: string
    risks: string[]
  }
}

interface ResearchResult {
  id: string
  query: string
  products_found: number
  status: 'running' | 'completed' | 'failed'
  top_products: Product[]
  analysis?: {
    trending_categories: string[]
    price_range: { min: number; max: number; avg: number }
    avg_rating: number
    recommendations: string[]
  }
  created_at: string
}

interface ProductResearchResultsProps {
  results: ResearchResult[]
  onImport?: (product: Product) => void
}

export function ProductResearchResults({ results, onImport }: ProductResearchResultsProps) {
  if (!results || results.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-[#111118] border border-white/10 text-center">
        <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">No research results yet.</p>
        <p className="text-sm text-slate-600 mt-1">Run Product Research to find trending products</p>
      </div>
    )
  }

  const latestResult = results[0]

  return (
    <div className="space-y-4">
      {/* Research Summary */}
      <div className="p-4 rounded-xl bg-[#111118] border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white">Latest Research: {latestResult.query}</h3>
            <p className="text-sm text-slate-400">
              {latestResult.products_found} products found • 
              Status: <span className={
                latestResult.status === 'completed' ? 'text-green-400' :
                latestResult.status === 'running' ? 'text-blue-400' :
                'text-red-400'
              }>{latestResult.status}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">
              {new Date(latestResult.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Analysis */}
        {latestResult.analysis && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-xs text-slate-500 mb-1">Price Range</p>
              <p className="text-white font-medium">
                ${latestResult.analysis.price_range.min.toFixed(2)} - ${latestResult.analysis.price_range.max.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">Avg: ${latestResult.analysis.price_range.avg.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-xs text-slate-500 mb-1">Avg Rating</p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-medium">{latestResult.analysis.avg_rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-xs text-slate-500 mb-1">Trending</p>
              <div className="flex flex-wrap gap-1">
                {latestResult.analysis.trending_categories.slice(0, 3).map((cat) => (
                  <span key={cat} className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px]">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {latestResult.analysis?.recommendations && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 mb-4">
            <h4 className="text-sm font-medium text-green-400 mb-2">Recommendations</h4>
            <ul className="space-y-1">
              {latestResult.analysis.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Top Products */}
      {latestResult.top_products && latestResult.top_products.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-white">Top Products ({latestResult.top_products.length})</h4>
          {latestResult.top_products.map((product) => (
            <div key={product.id} className="p-4 rounded-xl bg-[#111118] border border-white/10 hover:border-violet-500/30 transition-colors">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 rounded-lg bg-white/5 flex-shrink-0 overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-8 h-8 text-slate-600 m-6" />
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium text-white truncate">{product.title}</h5>
                      <p className="text-sm text-slate-400">{product.source} • {product.in_stock ? 'In Stock' : 'Out of Stock'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">${product.price.toFixed(2)}</p>
                      <p className="text-xs text-slate-500">{product.currency}</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 mt-2">
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-slate-300">{product.rating}</span>
                        {product.reviews_count && (
                          <span className="text-xs text-slate-500">({product.reviews_count})</span>
                        )}
                      </div>
                    )}
                    {product.sales_count && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="text-sm text-slate-300">{product.sales_count} sales</span>
                      </div>
                    )}
                    {product.profitability && (
                      <div className={`px-2 py-0.5 rounded text-xs ${
                        product.profitability.profitability === 'high' ? 'bg-green-500/20 text-green-400' :
                        product.profitability.profitability === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {product.profitability.profitability} profit
                      </div>
                    )}
                  </div>

                  {/* Profitability Analysis */}
                  {product.profitability && (
                    <div className="mt-2 p-2 rounded bg-white/5">
                      <p className="text-sm text-slate-300">{product.profitability.recommendation}</p>
                      {product.profitability.estimated_margin > 0 && (
                        <p className="text-xs text-green-400 mt-1">
                          <DollarSign className="w-3 h-3 inline" />
                          Est. margin: ${product.profitability.estimated_margin.toFixed(2)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-slate-300"
                      onClick={() => window.open(product.product_url, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    {onImport && (
                      <Button
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700"
                        onClick={() => onImport(product)}
                      >
                        <Package className="w-3 h-3 mr-1" />
                        Import to Store
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
