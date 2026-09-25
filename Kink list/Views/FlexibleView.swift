//
//  FlexibleView.swift
//  Kink list
//
//  Created on 12/7/24.
//

import SwiftUI

struct FlexibleView<Data: RandomAccessCollection, Content: View>: View where Data.Element: Hashable {
    var data: Data
    var spacing: CGFloat
    var alignment: HorizontalAlignment
    let content: (Data.Element) -> Content

    @State private var totalHeight: CGFloat = .zero

    var body: some View {
        VStack(alignment: alignment, spacing: spacing) {
            ForEach(generateRows(), id: \.self) { row in
                HStack(spacing: spacing) {
                    ForEach(row, id: \.self) { item in
                        content(item)
                    }
                }
            }
        }
        .background(viewHeightReader($totalHeight))
    }

    private func generateRows() -> [[Data.Element]] {
        var rows: [[Data.Element]] = []
        var currentRow: [Data.Element] = []
        var rowWidth: CGFloat = 0
        let maxWidth = UIScreen.main.bounds.width - 40

        for item in data {
            let itemWidth = estimateTextWidth(text: "\(item)", fontSize: 16) + 28

            if rowWidth + itemWidth > maxWidth {
                rows.append(currentRow)
                currentRow = [item]
                rowWidth = itemWidth
            } else {
                currentRow.append(item)
                rowWidth += itemWidth + spacing
            }
        }

        if !currentRow.isEmpty {
            rows.append(currentRow)
        }

        return rows
    }

    private func estimateTextWidth(text: String, fontSize: CGFloat) -> CGFloat {
        let font = UIFont.systemFont(ofSize: fontSize, weight: .medium)
        let attributes = [NSAttributedString.Key.font: font]
        let estimatedWidth = (text as NSString).size(withAttributes: attributes).width
        return min(estimatedWidth + 24, UIScreen.main.bounds.width * 0.4)
    }

    private func viewHeightReader(_ binding: Binding<CGFloat>) -> some View {
        GeometryReader { geometry in
            DispatchQueue.main.async {
                binding.wrappedValue = geometry.size.height
            }
            return Color.clear
        }
    }
}

