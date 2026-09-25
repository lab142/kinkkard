//
//  WrapGrid.swift
//  Kink list
//
//  Created on 12/7/24.
//

import SwiftUI

struct WrapGrid: View {
    var items: [String]
    var color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            FlexibleView(data: items, spacing: 10, alignment: .leading) { item in
                Text(item)
                    .font(.system(size: 16))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(color.opacity(0.8))
                    .foregroundColor(.white)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.white.opacity(0.5), lineWidth: 1)
                    )
            }
        }
        .padding(.horizontal, 12)
    }
}




